import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initial,advance,available,act,query,emptyFilters,contained,score} from '../src/engine.ts';
test('future evidence is invisible; initial outbound alert has its own earlier record',()=>{
 const ids=available(initial()).map(r=>r.id);
 assert.ok(ids.includes('PX-201'));
 for(const id of ['EP-201','EP-202','PX-202','EP-203','PX-203','PX-204'])assert.ok(!ids.includes(id));
 const s=advance(initial(),18);assert.ok(available(s).some(r=>r.id==='EP-202'));assert.ok(!available(s).some(r=>r.id==='PX-202'));
});
test('one large advance processes all scheduled attack stages in order',()=>{
 const s=advance(initial(),360);assert.deepEqual(s.occurred,['beacon','copy','transfer','theft']);assert.equal(s.ended,true);assert.equal(s.minute,360);
});
test('isolating FIN before the copy prevents lateral movement; later historical records remain',()=>{
 let s=advance(initial(),35);s=act(s,'isolate:FIN-WS-14');s=advance(s,300);
 assert.deepEqual(s.occurred,['beacon']);assert.ok(available(s).some(r=>r.id==='PX-202'));assert.ok(!available(s).some(r=>r.id==='EP-203'));
});
test('account revocation blocks lateral copy but does not remove host callbacks',()=>{
 const s=advance(act(initial(),'revoke'),300);assert.deepEqual(s.occurred,['beacon']);
});
test('FIN isolation after lateral copy cannot stop FILE-02 theft',()=>{
 let s=advance(initial(),100);s=act(s,'isolate:FIN-WS-14');s=advance(s,200);assert.ok(s.occurred.includes('theft'));
});
test('blocking egress after transfer starts prevents completion and preserves history',()=>{
 let s=advance(initial(),200);s=act(s,'block');s=act(s,'revoke');s=advance(s,150);
 assert.deepEqual(s.occurred,['beacon','copy','transfer']);assert.equal(contained(s),true);assert.ok(available(s).some(r=>r.id==='PX-203'));
});
test('actions apply on completion, after a boundary event',()=>{
 let s=advance(initial(),86);s=act(s,'isolate:FIN-WS-14');assert.ok(s.occurred.includes('copy'));
});
test('identical queries are cached, including empty results, until new matching evidence arrives',()=>{
 let s=query(initial(),emptyFilters);assert.equal(s.minute,5);s=query(s,emptyFilters);assert.equal(s.minute,5);
 s=advance(s,5);s=query(s,emptyFilters);assert.equal(s.minute,15);assert.ok(s.results.includes('EP-201'));
 const f={...emptyFilters,host:'DOES-NOT-EXIST'};s=query(s,f);const t=s.minute;assert.deepEqual(s.results,[]);s=query(s,f);assert.equal(s.minute,t);
});
test('filters combine host, user, IP, type and time without leaking future records',()=>{
 const s=query(initial(),{...emptyFilters,source:'Identity',user:'maya',ip:'203.0.113.77',type:'Authentication',from:'-10',to:'0'});assert.deepEqual(s.results,['ID-102']);
});
test('duplicate response requests do not charge twice; ended shifts reject actions',()=>{
 const s=act(initial(),'verify');assert.equal(s.minute,15);assert.equal(s.extras.length,1);assert.deepEqual(act(s,'verify'),s);
 const ended=advance(s,360);assert.deepEqual(act(ended,'block'),ended);assert.deepEqual(query(ended,emptyFilters),ended);
});
test('benign verification, triage, and conservative containment support a complete winning shift',()=>{
 let s=act(initial(),'verify');s=act(s,'triage:FIN-WS-14','FIN-WS-14');s=act(s,'block');s=act(s,'revoke');
 s={...s,statuses:['Confirmed incident','Confirmed incident','Explained benign','Explained benign','Explained benign'],bookmarks:['ID-102','EP-202','VR-101','DIR-301','DIR-401']};
 assert.equal(contained(s),true);assert.equal(score(s),100);assert.ok(s.extras.some(r=>r.id==='TR-FIN-WS-14'));
});
