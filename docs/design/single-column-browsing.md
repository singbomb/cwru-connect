# Single-column browsing

Updated November 8, 2026.

The user requested hiding the profile/filter sidebar for now and replacing side-by-side result cards with a single list. The browsing sidebar is hidden while retaining its DOM hooks for the existing controller. Jobs, lab and contact directories, and Home recommendations now use one column at all widths. The standalone Profile page is unchanged.

Verification: browser checks confirmed the sidebar is absent from the accessibility tree; lab cards share the same horizontal position and width and stack vertically; Network and Home use one grid column. Mobile had no horizontal overflow. Job search, save/unsave, and detail open/close still work. Code review found no actionable issues. This CSS/visibility-only change did not alter recommendation logic.

Preview: artifacts/showcase/single-column-labs.png.
