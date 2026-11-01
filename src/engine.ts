import {records, verification, triage} from './scenario.ts';
import type {RecordItem} from './scenario.ts';
export type Disposition='Uninvestigated'|'Investigating'|'Explained benign'|'Confirmed incident';
export type State={minute:number;statuses:Disposition[];bookmarks:string[];notes:string;links:string[];actions:string[];history:{minute:number;text:string}[];occurred:string[];extras:RecordItem[];cache:Record<string,string[]>;results:string[];ended:boolean;tutorial:boolean};
export const initial=():State=>({minute:0,statuses:Array(5).fill('Uninvestigated'),bookmarks:[],notes:'',links:[],actions:[],history:[],occurred:[],extras:[],cache:{},results:[],ended:false,tutorial:true});
export const clock=(m:number)=>m<0?`23:${String(60+m).padStart(2,'0')}`:`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
export const eventTime=(m:number)=>m< -60?'Previous day':clock(m);
export function advance(s:State,cost:number):State {
 const end=Math.min(360,s.minute+cost), occurred=[...s.occurred];
 for(const [t,key] of [[30,'beacon'],[90,'copy'],[180,'transfer'],[270,'theft']] as const){
  if(t<=s.minute||t>end)continue;
  const blocked=s.actions.includes('block');
  const fin=s.actions.includes('isolate:FIN-WS-14');
  const file=s.actions.includes('isolate:FILE-02');
  const account=s.actions.includes('revoke');
  if(key==='beacon'&&!blocked&&!fin)occurred.push(key);
  if(key==='copy'&&!fin&&!file&&!account)occurred.push(key);
  if(key==='transfer'&&occurred.includes('copy')&&!file&&!blocked)occurred.push(key);
  if(key==='theft'&&occurred.includes('transfer')&&!file&&!blocked)occurred.push(key);
 }
 return {...s,minute:end,occurred,ended:end===360||s.ended};
}
export const available=(s:State)=>[...records,...s.extras].filter(r=>r.available<=s.minute&&(!r.gate||s.occurred.includes(r.gate)));
export type Filters={source:string;host:string;user:string;ip:string;type:string;from:string;to:string;search:string};
export const emptyFilters:Filters={source:'All',host:'',user:'',ip:'',type:'',from:'',to:'',search:''};
export function query(s:State,f:Filters):State {
 if(s.ended)return s;
 const matches=(r:RecordItem)=>(f.source==='All'||r.source===f.source)&&(['host','user','ip','type'] as const).every(k=>r[k].toLowerCase().includes(f[k].toLowerCase()))&&(!f.from||r.time>=Number(f.from))&&(!f.to||r.time<=Number(f.to))&&Object.values(r).join(' ').toLowerCase().includes(f.search.toLowerCase());
 const fingerprint=available(s).filter(matches).map(r=>r.id).join(',');
 const key=JSON.stringify(f)+'|'+fingerprint;
 if(s.cache[key])return {...s,results:s.cache[key]};
 const next=advance(s,5);const results=available(next).filter(matches).map(r=>r.id);
 const nextKey=JSON.stringify(f)+'|'+results.join(',');
 return {...next,cache:{...s.cache,[nextKey]:results},results,history:[...next.history,{minute:next.minute,text:`Query · ${f.source}${f.host?' / '+f.host:''} · ${results.length} records (+5 min)`}]};
}
export function act(s:State,id:string,host='FIN-WS-14'):State {
 if(s.ended||s.actions.includes(id))return s;
 const cost=id==='verify'?15:id.startsWith('triage:')?10:5;
 let next=advance(s,cost); // The action takes effect at completion; scheduled events happen first.
 next={...next,actions:[...next.actions,id],history:[...next.history,{minute:next.minute,text:`${id} completed (+${cost} min)`}]};
 if(id==='verify')next.extras=[...next.extras,{...verification,time:next.minute,available:next.minute}];
 if(id.startsWith('triage:'))next.extras=[...next.extras,triage(host,next.minute)];
 return next;
}
export const contained=(s:State)=>(s.actions.includes('block')||s.actions.includes('isolate:FIN-WS-14'))&&s.actions.includes('revoke')&&(!s.occurred.includes('copy')||s.actions.includes('block')||s.actions.includes('isolate:FILE-02'));
export function score(s:State){const correct=s.statuses.filter((v,i)=>v===(i<2?'Confirmed incident':'Explained benign')).length;const evidence=s.bookmarks.filter(id=>['ID-102','ID-103','EP-201','EP-202','VR-101','DIR-301','DIR-401','DIR-501','PX-502'].includes(id)).length;const disruption=s.actions.filter(a=>a.startsWith('isolate:')).reduce((n,a)=>n+(a.endsWith('FILE-02')?15:a.endsWith('FIN-WS-14')?3:10),0);return Math.max(0,Math.min(100,correct*10+Math.min(20,evidence*4)+(contained(s)?30:0)-(s.occurred.includes('theft')?20:0)-disruption));}
