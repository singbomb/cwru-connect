# Research Connect showcase update

Implemented November 7, 2026.

- Removed demo notices, explanatory group introductions, card caveats, and repeated simulation copy from the interface.
- Hid internal scenario controls from the showcase while preserving their existing implementation.
- Changed profile sections to Hard skills and Interests; interests combine research interests and learning goals without changing matching inputs.
- Added the unchanged CWRU Athletics Spartan SVG beside Research Connect, served locally with the correct image MIME type.
- Reduced typography weights and simplified result counts and practical metadata.
- Preserved filtering, status labels, saved-item behavior, and detail panels.

Verification: 131 simulation checks passed; 51 PRD traceability checks passed; modified JavaScript passed syntax checks. Browser checks confirmed desktop profile labels, People feed switching, opening details, paid-only filtering and reset, logo loading, and a collapsed mobile profile with no horizontal document overflow. Code review found no actionable issues.

Screenshot: artifacts/showcase/research-connect.png.

This is a local showcase using existing fictional fixtures; applications and messaging remain unimplemented. Asset provenance is recorded in branding-assets.md. Design method: Unslop by Damir Sokolovsky (@heydamir), CC BY 4.0, https://github.com/heydamir/unslop.

## Opening-card refinement

Removed the discovery subtitle. Replaced the remaining-opening count label with a full-width Show more / Show less disclosure. Moved opening Save controls into the action row and removed first-card emphasis so every opening has the same outlined action style. Verified expansion/collapse, save toggling, one Save per card, matching action backgrounds, and mobile document width. All 131 simulation checks passed; follow-up code review found no actionable issues.

Screenshot: artifacts/showcase/research-connect-actions.png.
