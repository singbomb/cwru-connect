# Local demo code review

Date: October 27, 2026. Scope: the synthetic recommendation module, generator and validator, local server, document verifier, and demo application/rendering modules. This is a source and controlled-behavior review; it does not establish production authorization, real recommendation quality, or complete accessibility conformance.

## Resolved findings

| Priority | Finding | Resolution verified |
| --- | --- | --- |
| P2 | Invalid dates and non-finite or nonnumeric constraints could fail open and return expired or incompatible openings. | `validateOptions` rejects malformed option values; opening requirement validation fails closed. Reproductions with invalid dates, an impossible calendar date, `NaN` hours, and string duration now reject rather than return recommendations. |
| P2 | Dismissing an opening also removed its lab and people under strict filters. | Eligibility is derived before per-feed suppression. A paid-only reproduction preserves the exact lab and people results while hiding the dismissed opening. |
| P1 | The Dismiss button used `feedback.dismiss` instead of `feedback.dismissed` and threw. | The action maps to `dismissed`. A controlled DOM-stub check confirms that the key is stored and the result row disappears. |
| P2 | Malformed feedback strings in local storage caused recommendation failure with an ineffective profile-reset recovery. | Restored feedback is restricted to known dataset keys. A controlled check with `saved: ['bogus']` renders results successfully. |
| P2 | Replacing topic/schedule fieldset contents removed their legends. | Both fieldsets now have explicit `aria-label` attributes on the persistent elements, so replacing their children preserves their accessible names. |
| P2 | The empty-state Restore action removed its own button without restoring keyboard focus. | The action now focuses the stable active-view button after restoring preferences and rerendering results. |

## Remaining source findings

None identified within the reviewed source and controlled-behavior scope.

## Reviewed boundaries

The server normalizes request paths and checks the resolved demo/simulation directory allowlist. The source PRD and other project directories are outside that allowlist. Dynamic names, topics, reasons, contact text, and string attributes in the rendering module use HTML escaping; demo actions preview content and do not submit applications or send messages. Blank/invalid hours keep previous results, display an error on input, and set `aria-invalid` rather than passing a non-finite constraint to ranking.

The implementing agent separately reports real-browser checks of save persistence, dismiss/reset, preview/focus, already-contacted behavior, both feeds, and blank-hours validation. Those checks are distinct from this reviewer's source inspection and controlled Node/DOM-stub reproductions. Rendered visual review and assistive-technology testing have their own evidence boundaries.

Final source delta reviewed: result rows show the primary reason compactly while the preview retains the full escaped evidence list; people have specific no-result recovery guidance; summary counts apply the same saved-item predicate as the rendered groups. No additional actionable source issue was identified in these changes. The implementer's desktop/mobile geometry checks are separate from this source verdict.

## Review Summary

| Severity | Open count | Status |
| --- | --- | --- |
| CRITICAL | 0 | pass |
| HIGH | 0 | pass |
| MEDIUM | 0 | pass |
| LOW | 0 | pass |

Verdict: APPROVE at local-demo source scope. All six reported findings are resolved. Complete accessibility conformance and production security require separate verification.
