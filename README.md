# Midnight SOC

A complete frontend-only investigation game set at Northbridge Research. Five alerts, one connected intrusion, and a six-hour midnight shift. All identities, addresses, domains, and evidence are fictional.

Play at **https://kagesensei.github.io/midnightsoc/** once the GitHub Pages workflow completes. Pushes to `main` run tests, build the game, and deploy `dist` using GitHub Actions. The Vite base path is configured for this repository’s Pages URL.

## Run locally

Requires Node.js 22.18+ (Node 24 recommended).

```sh
npm install
npm run dev
```

Open the Vite URL printed in your terminal. `npm run build` creates the static production site in `dist`; `npm run preview` serves it. `npm test` checks the scenario engine and timing rules.

## Playing

The field guide opens on the first visit. Use quick queries to load filters, then run a query. Reading records, bookmarking, connecting evidence, taking notes, and choosing dispositions are free. Queries cost 5 minutes, triage 10, verification 15, and response actions 5. Repeated queries with unchanged matching evidence use a free cache. Time never advances by itself.

Response actions show costs and service effects before confirmation. Events during an action happen before it takes effect. Every alert must be marked explained benign or confirmed incident to end early; otherwise the shift ends at 06:00. The debrief explains the scenario and evaluates decisions, evidence, containment, data loss, and business disruption. There is no single-mistake failure.

Progress, notes, and evidence save to this browser’s localStorage after changes. Restart clears that save after confirmation. A browser with blocked storage can still play, but must keep its tab open. No backend, credentials, AI service, or runtime API is used.

## Structure

- `src/scenario.ts`: evidence, alerts, asset context, employee responses, and triage content. Event timestamps and availability are separate fields.
- `src/engine.ts`: pure state transitions, chronological event processing, filters, cache, response effects, and assessment.
- `src/main.tsx`: accessible React workstation, tutorial, explorer, evidence board, notebook, confirmations, and debrief.
- `src/style.css`: responsive desktop/tablet workstation styling.
- `tests/engine.test.mjs`: chronological progression, evidence visibility, containment boundaries, caches, and scoring.

To extend the game, add content to the scenario module and explicitly define its scheduled events and response conditions in the engine. Historical records remain visible after containment. Scenario conclusions are revealed in the final debrief, not inferred automatically from the severity labels.
