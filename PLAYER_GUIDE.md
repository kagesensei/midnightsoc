# Midnight SOC — Player guide

You are the midnight analyst at Northbridge Research, a newly acquired subsidiary of Stratum Prime. Your job is to explain five alerts, identify any connected intrusion, and protect business operations. You do not need cybersecurity experience or a real query language.

## Your first five minutes

1. Close the opening briefing with **Begin the shift**. Start with **Maya Chen** in the left alert queue.
2. Find **Analyst coach** above the investigation. Press **Load Maya's query**. This fills the filters for free; it does not execute a search.
3. In **Evidence explorer**, press **Run query**. A new query advances the simulated clock by five minutes.
4. Open **ID-102**, the successful authentication record. Read its MFA result and session identifier. Compare it with the failed sign-ins and remote session. Opening records is free.
5. Ask what would distinguish Maya's own activity from someone using her password. **Contact employee** in the Response desk lets you review and confirm a 15-minute verification request.

The coach updates as you read records and gather evidence. **Need another hint?** expands a more specific suggestion without spending time. You can hide guidance and restore it at any point; there is no score penalty for using hints.

## Find your way around

| Interface | Use it to |
| --- | --- |
| Alert queue, left | Select one of five alerts and see its current disposition. All five arrive at 00:00. |
| Analyst coach | See your next investigation objective and load a relevant query. |
| Evidence explorer, center | Search identity, endpoint, DNS, proxy, and directory records. |
| Source tabs | Choose a source filter for your next query. Changing a tab does not rerun the current results. |
| Quick queries | Fill filters for an entity, historical activity, or tickets/assets. Press Run query afterward. |
| Record window | Read full details and bookmark evidence. Event time and availability time are separate. |
| Evidence board | Choose two bookmarked records and connect them to document a relationship. |
| Notebook | Record observations, uncertainties, and your reasons for decisions. Notes save while you type. |
| Your assessment | Set the selected alert's disposition below the evidence explorer. |
| Response desk, right | Verify an employee, collect endpoint triage, or review a containment action. On smaller screens this sits below the workspace. |
| Service health | See business functions interrupted by your endpoint isolation choices. |
| Field guide / question-mark button | Reopen the short briefing at any time. |

## What you are trying to establish

An alert is a lead. High severity does not mean malicious, and low severity does not mean safe.

For a suspicious sign-in, compare the employee's usual activity, MFA result, device, session, and subsequent actions. An unfamiliar IP address alone is not proof. MFA means multi-factor authentication: an additional check beyond a password. A legacy exception can allow a login without that extra check.

An endpoint is a workstation or server. A process is a running program; its parent tells you which program launched it. A hash is a file fingerprint that can be compared with an approved version. DNS connects a domain name to an address. Proxy records describe traffic leaving the organization.

For potentially legitimate activity, look for independent confirmation:

- A deployment: does the change ticket match the script, hash, parent process, and allowed time?
- A scan: do the authorized scanner, target scope, and maintenance window match?
- A backup: do the destination, scheduled job, and historical activity match?

You can revisit evidence after containment. A connection on your board represents your reasoning, not an automatic game verdict.

## Time and costs

The shift runs from 00:00 to 06:00. The clock never advances just because you are reading or thinking.

| Action | Simulated cost |
| --- | --- |
| Read alerts/records, bookmark, connect evidence, write notes, choose a disposition, use hints | Free |
| Run a new log query | 5 minutes |
| Request endpoint triage | 10 minutes |
| Contact an employee | 15 minutes |
| Perform a response action | 5 minutes |
| Wait manually, after confirmation | 15 minutes |

An identical query with unchanged matching evidence returns its cached result for free. New matching records can make a repeated query cost time again. Queries can return no matches: broaden the filters, check the event range, or consider whether the activity has happened yet. Future evidence never appears early.

Response actions take effect at completion. Events that happen during those minutes occur first. Do not wait simply to make the clock look realistic; wait when there is an investigation reason to do so.

## Gather evidence before acting

Employee verification adds a response record. Endpoint triage captures process and persistence context without interrupting service. Read those returned records rather than treating the action itself as a conclusion. They can be found through a relevant query; the first-investigation coach also offers a direct link to the employee response.

Bookmark useful records from their detail windows. On the Evidence board, select two record IDs and press **Connect**. A useful notebook entry distinguishes observation from inference: “Same session appears on the workstation; I still need to establish what it accessed.”

## Choose proportionate responses

Every response opens a confirmation explaining cost and effects. Review the selected target carefully.

- **Secure Maya's account** revokes sessions and requires recovery with MFA. It does not remove a process already running on an endpoint.
- **Block destination** stops traffic to the specified destination across hosts. Consider whether evidence supports the destination being involved.
- **Isolate endpoint** disconnects the selected host. It affects that host only and can interrupt business. Read the asset directory before isolating a critical shared service.

The goal is to stop unauthorized access and data movement while preserving operations. One mistake does not end the game.

## Decide and hand off

Use **Your assessment** for each selected alert:

- **Uninvestigated:** you have not started.
- **Investigating:** you are gathering or checking evidence.
- **Explained benign:** the observed activity matches a supported legitimate explanation.
- **Confirmed incident:** independent evidence supports unauthorized activity.

You can revise any assessment before the shift ends. Once all five alerts have a final disposition, **End shift & hand off** becomes available. Check containment and service health before ending early; classifying alerts does not itself contain an incident. At 06:00 the shift ends automatically.

The debrief explains the underlying scenario and reviews dispositions, bookmarked evidence, containment, business disruption, and any completed theft. This guide avoids revealing every conclusion so you can investigate for yourself.

## Save, restart, and recover

Progress saves automatically to this browser's local storage. Reading history and guidance visibility are also saved. Closing and reopening on the same browser and site resumes the shift. Saves do not synchronize across devices. Private browsing, clearing site data, or blocked browser storage can prevent persistence.

Use the restart icon in the top bar to review a confirmation before clearing the shift. Existing saves from earlier versions remain usable; the coach may ask you to reopen a record because earlier versions did not track which records you read.

## Frameworks: learn the behavior first

The current opening investigation introduces [MITRE ATT&CK Valid Accounts, T1078](https://attack.mitre.org/techniques/T1078/) after you read the successful login. It describes possible abuse of real credentials; it does not prove a particular login was malicious. No technique identifiers are required to play or score well.

Future campaign direction, **not currently playable**:

1. Enterprise investigations at Northbridge introduce ATT&CK through evidence.
2. Incidents affecting Stratum Prime's AI systems introduce [MITRE ATLAS](https://atlas.mitre.org/).
3. Orbital and ground-system incidents introduce [The Aerospace Corporation's SPARTA](https://sparta.aerospace.org/).

These are external reference frameworks. The fictional game is not affiliated with or endorsed by their maintainers. The first version does not yet simulate AI or satellite incidents, unreliable automation, or the rest of Stratum Prime's global assets.
