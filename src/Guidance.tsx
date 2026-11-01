import {BookOpen, ChevronRight, CircleHelp} from 'lucide-react';
import type {State,Filters} from './engine';
import {available,contained} from './engine';
import type {RecordItem} from './scenario';

type Props={state:State;selected:number;onQuery:(f:Partial<Filters>)=>void;onOpen:(r:RecordItem)=>void;onVerify:()=>void;onResponse:()=>void;onAssessment:()=>void;onNext:()=>void;onToggle:()=>void};

export function Guidance({state:s,selected,onQuery,onOpen,onVerify,onResponse,onAssessment,onNext,onToggle}:Props){
 const read=(id:string)=>s.readRecords?.includes(id);
 const records=available(s);
 const open=(id:string)=>{const record=records.find(r=>r.id===id);if(record)onOpen(record)};
 let step='01',title='Start here: investigate Maya’s sign-in',body='Your first question is whether Maya actually initiated the successful login. Load her records, then press Run query in the explorer below.',label='Load Maya’s query · free',hint='Loading filters is free. Running a new query costs 5 minutes. Open ID-102 and compare its source, MFA result, and session with ID-101 and ID-103.',next=()=>onQuery({user:'maya.chen'});
 if(s.results.includes('ID-102')&&!read('ID-102')){
  title='Open the successful sign-in';body='Your query returned records. Open ID-102 and look for the MFA result. A correct password does not establish who used it.';label='Read ID-102 · free';next=()=>open('ID-102');
 }else if(read('ID-102')&&!s.actions.includes('verify')){
  step='02';title='Check the person behind the account';body='The record says MFA was not required. That is a policy weakness, not proof of intrusion. Contact Maya through the trusted directory to verify the activity.';label='Review employee contact · 15 min';hint='The Response desk is on the right (below the explorer on smaller screens). Contact employee opens a cost confirmation. Read the returned verification record afterward.';next=onVerify;
 }else if(s.actions.includes('verify')&&!read('VR-101')){
  step='03';title='Read Maya’s verification response';body='The employee contact is complete. Her statement is a new evidence record; read it and compare it with the sign-in history.';label='Read verification · free';hint='An employee statement is supporting evidence. Corroborate it with a session, a process, or file activity before reaching a conclusion.';next=()=>open('VR-101');
 }else if(read('VR-101')&&!read('EP-202')){
  step='04';title='Follow the session to FIN-WS-14';body='Now look for what the session did on the workstation. Load the host query, run it, and inspect the file-access and archive records when available.';label='Load workstation query · free';hint='Compare ID-103 with EP-201 and EP-202. Shared session S-884 and unexpected activity are stronger clues than an unfamiliar IP alone. Evidence appears only after its event time.';next=()=>onQuery({host:'FIN-WS-14'});
  if(s.results.includes('EP-202')){label='Read archive record · free';next=()=>open('EP-202')}
 }else if(read('EP-202')&&(!s.bookmarks.includes('ID-102')||!s.bookmarks.includes('EP-202'))){
  step='05';title='Save the evidence behind your conclusion';body='Bookmark the successful sign-in and archive records. In Evidence board, connect them and note the shared identity or session. Connections document your reasoning; they do not automatically prove a case.';label='Open a record to bookmark · free';hint='Use Bookmark evidence inside each record. Then open Evidence board, select two record IDs, and press Connect. Taking notes and building the board never move the clock.';next=()=>open(!s.bookmarks.includes('ID-102')?'ID-102':'EP-202');
 }else if(read('EP-202')&&!contained(s)){
  step='06';title='Review a proportionate response';body='You have independent clues from identity, the employee, and endpoint activity. Review response effects and service impact. Securing an account does not stop a process already running on a host.';label='Review response desk';hint='Consider account access and network traffic separately. A destination block affects matching traffic across hosts. Isolation affects only the selected host and can interrupt business. Check which hosts are involved before acting.';next=onResponse;
 }else if(contained(s)){
  step='07';title='Containment is recorded. Finish the investigation.';body='Give each alert your evidence-backed assessment using Your assessment below the explorer. Investigate the other alerts before ending the shift; their severity is not a verdict.';label='Go to assessment';hint='Confirmed incident means the evidence supports unauthorized activity. Explained benign means observed activity matches an approved explanation. Investigating keeps a question open.';next=onAssessment;
 }
 if(selected>0){
  const contexts=[
   {title:'Compare the traffic with the workstation',body:'Load FIN-WS-14 across all sources. Compare the first connection with identity and process activity; a new domain alone does not establish compromise.',host:'FIN-WS-14',hint:'Distinguish the initial connection from later recurring callbacks or bulk transfers. Check event times and related sessions. Read asset importance before isolating a host.'},
   {title:'Is the script expected?',body:'Look at ENG-WS-03 endpoint events and its directory records. You need to compare the observed execution with its approval.',host:'ENG-WS-03',hint:'Look for a change ticket, an expected parent process, an approved hash, and the allowed execution window. A script interpreter can be used legitimately.'},
   {title:'Who authorized the network scan?',body:'Load SCAN-01 across sources. Compare the observed scan with asset ownership and the approved maintenance schedule.',host:'SCAN-01',hint:'Check the source address, target scope, and maintenance window. A scanner asset name alone is not enough to explain every scan.'},
   {title:'Is the transfer consistent with a backup?',body:'Load BACKUP-01 across sources. Compare the destination, scheduled job, and previous nights before deciding.',host:'BACKUP-01',hint:'A large volume can be normal. Check the approved destination and certificate, the job schedule, and historical volume and timing.'},
  ];
  const context=contexts[selected-1];step=String(selected+1).padStart(2,'0');title=context.title;body=context.body;hint=context.hint;label=`Load ${context.host} query · free`;next=()=>onQuery({host:context.host});
 }
 if(['Explained benign','Confirmed incident'].includes(s.statuses[selected])){title='Assessment saved. What is still unresolved?';body='Check your notebook and supporting evidence, then choose another unresolved alert. You can revise a disposition at any time before ending the shift.';label='Open next unresolved alert';next=onNext;hint='If every alert has a final disposition, End shift & hand off becomes available in the Response desk. Review containment and service health before ending early.'}
 return <section className="beginner-guide" aria-label="Investigation guidance"><div className="guidance-header"><span className="eyebrow"><BookOpen size={15}/> ANALYST COACH · {step}</span><button onClick={onToggle} aria-expanded={!s.hintsHidden}>{s.hintsHidden?'Show guidance':'Hide guidance'}</button></div>{!s.hintsHidden&&<><h2>{title}</h2><p>{body}</p><button className="guidance-action" onClick={next}>{label}<ChevronRight size={14}/></button><details><summary><CircleHelp size={13}/> Need another hint?</summary><p>{hint}</p></details>{read('ID-102')&&selected===0&&<details><summary>Framework context: ATT&amp;CK</summary><p>Valid Accounts describes how legitimate credentials can be abused. It is a description of behavior, not proof that a particular login is malicious. You never need to memorize an identifier to progress. <a href="https://attack.mitre.org/techniques/T1078/" target="_blank" rel="noreferrer">Read MITRE’s T1078 reference</a>.</p></details>}<a className="player-guide-link" href={`${import.meta.env.BASE_URL}PLAYER_GUIDE.md`} target="_blank" rel="noreferrer">Open full player guide ↗</a></>}</section>;
}
