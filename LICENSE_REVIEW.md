# Commercial-release license review

Reviewed 2026-11-01 against the installed lockfile and dependency license files.

## Project license

The original `LICENSE` was the Unlicense: it permits commercial use by both the owner and other recipients, including copying, modifying, redistributing, and selling the game. It dedicates the work to the public domain where recognized. It does not reserve exclusive commercial reuse to the developer.

Making the source public does not require choosing an open-source license. If reserving commercial reuse is important, choose appropriate proprietary terms before publication. MIT also allows other people to sell copies, with attribution requirements. Neither MIT nor the Unlicense provides commercial exclusivity.

A change in terms cannot be assumed to revoke rights already granted in earlier versions. The Git history contains the earlier Unlicense, so replacing the current file is not a guarantee of exclusive rights to the existing version. Get a qualified lawyer's advice before relying on exclusivity or finalizing commercial distribution terms. This is a technical license inventory, not legal clearance or a determination of copyright ownership.

The current `LICENSE` now reserves rights prospectively and permits personal, non-commercial play of the official hosted version. This is a practical project policy, not a guarantee of exclusivity over material previously covered by the Unlicense.

## Bundled dependencies

| Package | Installed version | License |
| --- | --- | --- |
| React | 19.3.1 | MIT |
| React DOM | 19.3.1 | MIT |
| Scheduler | 0.28.0 | MIT |
| Lucide React | 0.468.0 | ISC, with MIT Feather portions |

These licenses permit commercial use subject to retaining the required copyright and license notices. `public/THIRD_PARTY_NOTICES.txt` includes those notices and is copied into the production build by Vite. Third-party licenses remain applicable independently of the game's own terms.

The lockfile's development/build dependencies report MIT, ISC, BSD-3-Clause, and Apache-2.0 licenses. These tools are used to build the site; they are not intentionally distributed as part of the browser game. Recheck notices if future features bundle additional libraries or redistribute tools.

The application uses system font fallbacks and Lucide icons; it contains no downloaded images, commercial fonts, external game art, or AI service dependency. Future artwork, audio, fonts, contributor code, and scenario material need their own rights review.

References: [Unlicense](https://choosealicense.com/licenses/unlicense/), [MIT](https://choosealicense.com/licenses/mit/), [public repositories without an open-source license](https://choosealicense.com/no-permission/).
