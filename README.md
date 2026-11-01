# Midnight SOC

A frontend-only investigation game set at Northbridge Research, a newly acquired subsidiary of **Stratum Prime**. Five alerts, one connected intrusion, and a six-hour midnight shift. All identities, addresses, domains, and evidence are fictional.

Play at **https://kagesensei.github.io/midnightsoc/**. Pushes to `main` run tests, build the game, and deploy `dist` using GitHub Actions. The Vite base path is configured for this repository’s Pages URL.

## Run locally

Requires Node.js 22.18+ (Node 24 recommended).

```sh
npm install
npm run dev
```

Open the Vite URL printed in your terminal. `npm run build` creates the static production site in `dist`; `npm run preview` serves it. `npm test` checks the scenario engine and timing rules.

## Playing

**New player? Start with [PLAYER_GUIDE.md](PLAYER_GUIDE.md).** It explains the interface, your first investigation, action costs, response tradeoffs, and how to finish the shift without revealing every answer. The same guide is accessible inside the game.

The field guide opens on the first visit. A persistent **Analyst coach** then gives you a concrete next step: load Maya's query, run it, inspect the successful login, verify with the employee, follow the workstation activity, preserve evidence, and review your response. Optional expandable hints explain the controls and reasoning. Guidance is free, can be hidden, and supports existing local saves. Use quick queries to load filters, then run a query. Reading records, bookmarking, connecting evidence, taking notes, and choosing dispositions are free. Queries cost 5 minutes, triage 10, verification 15, and response actions 5. Repeated queries with unchanged matching evidence use a free cache. Time never advances by itself.

Response actions show costs and service effects before confirmation. Events during an action happen before it takes effect. Every alert must be marked explained benign or confirmed incident to end early; otherwise the shift ends at 06:00. The debrief explains the scenario and evaluates decisions, evidence, containment, data loss, and business disruption. There is no single-mistake failure.

Progress, notes, and evidence save to this browser’s localStorage after changes. Restart clears that save after confirmation. A browser with blocked storage can still play, but must keep its tab open. No backend, credentials, AI service, or runtime API is used.

## Setting and campaign direction

**Stratum Prime ? The infrastructure of everything.** A fictional conglomerate spanning cloud, operating systems, AI, telecom, commerce, maritime, air, and orbital infrastructure. Its board redirected QA funding into a virtual-reality metaverse for automated warehouse forklifts. The immaculate corporate surface conceals fragmented acquisitions and fragile automation.

The playable first shift stays deliberately small: Northbridge's five alerts and one connected intrusion. Its interface now identifies Northbridge as part of Stratum Prime. The wider divisions, crashing automation, AI incidents, and satellite missions are **campaign plans, not implemented mechanics**.

Frameworks will enter through observed behavior, without requiring players to memorize identifiers. The first investigation includes optional context for [ATT&CK Valid Accounts (T1078)](https://attack.mitre.org/techniques/T1078/). Planned later investigations introduce [MITRE ATLAS](https://atlas.mitre.org/) for AI threats and [Aerospace SPARTA](https://sparta.aerospace.org/) for space-system threats. Framework labels describe behavior; they do not replace evidence or establish guilt. No affiliation or endorsement is implied.

## Structure

- `src/scenario.ts`: evidence, alerts, asset context, employee responses, and triage content. Event timestamps and availability are separate fields.
- `src/engine.ts`: pure state transitions, chronological event processing, filters, cache, response effects, and assessment.
- `PLAYER_GUIDE.md`: player-facing instructions, beginner walkthrough, glossary, and framework roadmap. Copied into the site automatically before development/build.
- `src/Guidance.tsx`: contextual beginner objectives, optional hints, and evidence-gated framework context.
- `src/main.tsx`: accessible React workstation, tutorial, explorer, evidence board, notebook, confirmations, and debrief.
- `src/style.css`: responsive desktop/tablet workstation styling.
- `tests/engine.test.mjs`: chronological progression, evidence visibility, containment boundaries, caches, and scoring.

To extend the game, add content to the scenario module and explicitly define its scheduled events and response conditions in the engine. Historical records remain visible after containment. Scenario conclusions are revealed in the final debrief, not inferred automatically from the severity labels.

## License and commercial plans

The current project terms reserve rights while permitting personal, non-commercial play of the official hosted game. Redistribution and commercial reuse require permission, subject to existing third-party licenses, statutory rights, GitHub terms, and any earlier grants. See [LICENSE](LICENSE), [license review](LICENSE_REVIEW.md), and [third-party notices](public/THIRD_PARTY_NOTICES.txt).

Earlier revisions contained the Unlicense. The current terms do not revoke earlier permissions and do not establish exclusivity over already released material. Obtain legal review before relying on commercial exclusivity or finalizing paid distribution terms.
