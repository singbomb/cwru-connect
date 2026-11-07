# Impeccable demo review

Date: October 27, 2026  
Target: `demo-index-html` (`demo/index.html`, `demo/styles.css`, `demo/app.mjs`, `demo/render.mjs`)  
Method: independent finishing reviewer using the shipped Impeccable reviewer instructions, followed by one correction round and a verdict pass. Code review was a separate agent. The planning review is recorded in `docs/impeccable-plan-review.md`.

## Direction and scope

The user selected the university catalog direction and then requested a sharper LinkedIn/Indeed style. The local demo retains the selected blue sidebar/results arrangement with Public Sans, divided result rows, native controls, and attached recommendation evidence. The production identity remains open. The direction contract is saved in `.impeccable/surfaces/demo-index-html.md`; seed reference: `seed:24bcc867a9755486`.

This was a code-led build. No raster comp was approved or used. No shipping raster assets were produced; Public Sans is self-hosted with its license. The selected sketch records initial composition, while the user's later sharper-style correction governs the refined typography and density.

## Findings and resolution

The first capture packet contained a phone screenshot taken before the compositor settled after resizing. It was rejected without a design verdict. All four captures were replaced and their native dimensions verified before the full review.

The full review found the typography, material, cool ground, synthetic labeling, separate feeds, and selected topology consistent. It required these corrections:

| Finding | Final change | Reviewer verdict |
|---|---|---|
| Desktop lacked two useful result rows in the initial viewport | Compact two-column row geometry, concise counts, and reduced introductory spacing; evidence, metadata, and primary actions retained | Resolved |
| First phone actions fell below the initial viewport | Compact evidence, reduced introduction, collapsed profile controls, and concise section/count structure | Resolved |
| People empty-state advice suggested opening-only availability controls | People recovery now names paid/beginner filters, hidden feedback, and interests, while stating the availability-control boundary | Resolved |

Final reviewer disposition: **ship for the three scored fixes**. The verdict reported no fix-induced regressions. It was a correction verdict rather than a new whole-surface audit.

## Evidence

- Desktop at 1112 × 720: the first two complete opening rows end at approximately 541 and 718 pixels. Both include research evidence, practical metadata, and a primary action.
- Phone at 390 × 844: the first opening's evidence/action end at approximately 711/769 pixels; the first person's evidence/action at 708/794 pixels. Neither tested viewport has horizontal overflow.
- Captures: `.impeccable/review/desktop.png`, `mobile.png`, `mobile-people.png`, and `mobile-no-match.png`.
- Functional browser checks and boundaries: `docs/demo-verification.json`.
- Source review: all six reported findings resolved in `docs/code-review.md`; final rendering/count deltas produced no new actionable source finding.

## Detector and run notes

One source detector run found an 11-pixel tiny-text warning, retained as the raw result in `docs/impeccable-detector.json`. The affected status and mobile notice/link styles were increased to at least 12 pixels. The detector was not rerun; this report does not claim a zero-finding detector receipt.

No ignore rules were added. The reviewer was independent of implementation. The in-app browser was shown for the requested preview and native viewport captures were used; temporary viewport overrides are reset at handoff. No detector overlay was injected and no detector live server was started. The direction-choice server completed when the user selected a card. No temporary raster assets were left behind.

This review covers the local synthetic demonstration. Full assistive-technology testing, complete WCAG conformance, production authorization, real recruiting inventory, and real recommendation usefulness remain separate implementation and pilot gates.
