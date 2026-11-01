import {test, after} from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import {initial, act, advance} from '../src/engine.ts';

const server = await createServer({server:{middlewareMode:true,watch:null},appType:'custom'});
const {Guidance} = await server.ssrLoadModule('/src/Guidance.tsx');
after(()=>server.close());
function render(state=initial(),selected=0){
 const noop=()=>{};
 return renderToStaticMarkup(createElement(Guidance,{state,selected,onQuery:noop,onOpen:noop,onVerify:noop,onResponse:noop,onAssessment:noop,onNext:noop,onToggle:noop}));
}
test('old saves without guidance fields get a clear starting instruction',()=>{
 const state=initial();
 assert.match(render(state),/Start here: investigate/);
 assert.match(render(state),/press Run query/);
 assert.doesNotMatch(render(state),/T1078/);
 assert.match(render(state),/\/midnightsoc\/PLAYER_GUIDE.md/);
});
test('reading identity evidence unlocks verification and optional ATT&CK context',()=>{
 const state={...initial(),readRecords:['ID-102']};
 assert.match(render(state),/Check the person behind the account/);
 assert.match(render(state),/T1078/);
 assert.match(render(state),/not proof of intrusion/);
});
test('verification leads to reading its response, then investigating the host',()=>{
 const state=act({...initial(),readRecords:['ID-102']},'verify');
 assert.match(render(state),/Read Maya’s verification response/);
 assert.match(render({...state,readRecords:['ID-102','VR-101']}),/Follow the session to FIN-WS-14/);
});
test('evidence preservation precedes response coaching; containment leads to assessment',()=>{
 let state={...advance(initial(),25),readRecords:['ID-102','VR-101','EP-202'],actions:['verify']};
 assert.match(render(state),/Save the evidence/);
 state={...state,bookmarks:['ID-102','EP-202']};
 assert.match(render(state),/Review a proportionate response/);
 state=act(act(state,'block'),'revoke');
 assert.match(render(state),/Containment is recorded/);
});
test('each other alert has a relevant investigative prompt without automatic classification',()=>{
 for(const [selected,phrase] of [[1,'Compare the traffic'],[2,'Is the script expected'],[3,'Who authorized'],[4,'consistent with a backup']]){
  assert.match(render(initial(),selected),new RegExp(phrase));
 }
});
test('guidance can be hidden and resolved alerts lead to remaining work',()=>{
 assert.doesNotMatch(render({...initial(),hintsHidden:true}),/Start here/);
 assert.match(render({...initial(),hintsHidden:true}),/Show guidance/);
 const state=initial();state.statuses[0]='Confirmed incident';
 assert.match(render(state),/Open next unresolved alert/);
});
