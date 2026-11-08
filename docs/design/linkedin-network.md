# LinkedIn-inspired Network

Updated November 8, 2026, from the user's LinkedIn screenshots.

Network now has a Manage my network sidebar, Discover/Saved contacts tabs, and a people-card panel. Each card has a cover strip, circular portrait, name, role, lab, school, research areas, Save, Hide, and View profile. Saved controls and counts use the existing per-student browser preferences. View profile opens the existing contact drawer.

No invitations, live connection requests, mutual contacts, or social statistics were invented. The layout override applies only to Network; Jobs, Home recommendations, and Find labs remain single-column. The old profile/filter sidebar stays hidden. Portraits are illustrative placeholders with sources recorded in branding-assets.md.

Implementation: demo/network.css, demo/network.mjs, Network markup in demo/index.html and demo/render.mjs, and synchronization in demo/app.mjs. Eight cards appear initially; Show all expands the rest. Desktop supports four columns and progressively reduces the grid for smaller viewports.

Verification:
- 131 simulation checks passed.
- Six focused rendering assertions and all 30 portrait-path checks passed.
- Modified JavaScript syntax and diff checks passed.
- Code review found no actionable issues.
- Browser verified Save and unsave, synchronized counts and tabs, saved empty state, name search, profile drawer and close, and Show all / Show fewer.
- Test saved contact was removed after verification.
- Desktop showed four columns with the eight initial portraits loaded and no document overflow; mobile used one column with no overflow.
- Jobs remained single-column and its Network sidebar stayed hidden.
- Browser console logs were empty in the checked session.

Previews: artifacts/showcase/network-linkedin-desktop.png and artifacts/showcase/network-linkedin-mobile.png.
