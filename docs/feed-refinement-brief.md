# Feed refinement

Date: October 27, 2026. User feedback: the feed remains monotonous and lifeless after the first sharpness pass. Scope is the recommendation feed, within the existing blue/Public Sans catalog identity. Recommendation inputs, ranking, permissions, fixtures, and the surrounding header/profile tools remain unchanged.

## Visual direction

Make research subjects lead opening titles, give labs an exploratory topic layout, and give people an identity-led contact layout. Use the existing type, color, radius, and divider vocabulary. Distinct initials identify fictional entities without fabricating photography. Keep two opening results visible first, then expose lab discovery and an explicit expansion for remaining openings. Each result keeps its primary reason, recruiting state, and permitted preview action. Save stays visible; dismiss and already-contacted move into a native secondary disclosure.

## Motion thesis

- Focal moment: on a profile/filter/feed change, surviving rows move from their previous positions to their new positions; newly appearing rows receive a brief evidence-blue highlight. No page-load choreography.
- Continuity: preserve result keys, recommendation order, disclosure semantics, and keyboard focus. Cancel superseded animations when preferences change again.
- Feedback: saving briefly acknowledges the bookmark state; dismissing has a bounded exit before the local feedback is committed. Counts and live status remain readable.
- Budget: native Web Animations only, no dependencies or loops; animate only visible rows, at most twelve, for approximately 120–220ms. Reduced motion removes spatial changes and retains gentle color/state feedback.

## Verification

Inspect the actual 643px user viewport, 1112px desktop, and 390px phone. Verify no horizontal overflow, readable metadata, preview-only actions, save/dismiss/reset, expanded secondary controls, profile/filter updates, keyboard focus, and reduced-motion code paths. Review the final result with fresh eyes because the user explicitly rejected the previous feed's rhythm. Retain simulation labels and the separation between relevance, opening availability, and contact authority.
