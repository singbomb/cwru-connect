# CWRU Connect navigation and Home

Implemented November 7, 2026, using the user-supplied Northeastern recruiting-site recording as a layout reference.

## Delivered

- Renamed the visible product to CWRU Connect.
- Brightened the blue accent to #0864cf and used it for the header and Home feature panel.
- Added Home, Jobs, Find labs, Network, and Messaging navigation, plus the profile icon at the far right.
- Added a Home landing section with job and lab links, followed by recommended openings on scroll.
- Separated job postings, the broader lab directory, and research contacts into searchable views.
- Kept job availability and compensation filters out of broader lab and network discovery.
- Added a resume-style profile page and a Messaging inbox empty state.
- Preserved consistent opening buttons, Save controls, and Show more / Show less sections.

Hash navigation and view preparation live in demo/navigation.mjs. The new shell styles live in demo/shell.css. Recommendation logic and original fictional fixtures were preserved.

## Verification

- 131 simulation checks passed.
- 51 documentation traceability and source-integrity checks passed.
- 9 focused rendering and search assertions passed.
- JavaScript syntax checks passed for modified modules.
- Browser checks covered all navigation destinations, job/topic/name search, profile fields, Home recommendation scrolling, and mobile document overflow.
- Review identified two regressions that were fixed and verified: in-page skip links preserve the current route, and invalid job hours do not block directory-interest changes.
- Browser verification confirmed the skip link focuses the main region while remaining in Find labs, and directory ordering updates after changing interests even with an invalid hidden hours input.
- Code review found no remaining actionable issues.

Previews: artifacts/showcase/cwru-connect-home.png and artifacts/showcase/cwru-connect-home-mobile.png.

## Scope

This remains a local showcase. Messaging presents an empty inbox and a network link; it does not send messages. No application submission, authentication, or public deployment was added.

Design assistance: frontend-design skill. Existing design method credit: Unslop by Damir Sokolovsky (@heydamir), CC BY 4.0, https://github.com/heydamir/unslop. Spartan asset provenance remains in branding-assets.md.
