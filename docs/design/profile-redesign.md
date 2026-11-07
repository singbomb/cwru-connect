# Recruiting profile redesign

Implemented November 7, 2026.

The profile now uses a conventional recruiting layout: a photo introduction card, editable About section, Hard skills, Interests, Education, Resume, and Research preferences. The same generic internet-sourced photo appears in the header and profile. Its provenance is in branding-assets.md; it does not identify the fictional student.

About edits save per student in localStorage. Resumes save per student in IndexedDB on this device and survive reloads. Add, replace, download, and remove are implemented. Files must be nonempty PDF or DOCX documents up to 5 MB. Browser-side type/size checks provide input guidance, not malware scanning; files are not parsed, executed, or transmitted to a server.

Implementation: demo/profile.mjs and demo/profile.css, with wiring in demo/navigation.mjs and demo/app.mjs. The previous oversized cover and initials avatar were removed. The local server now serves JPEG assets.

Verification:
- 131 simulation checks and 51 documentation checks passed.
- Six focused resume validation assertions passed, covering supported formats, unsupported types, empty files, oversized files, and MIME mismatch.
- JavaScript syntax checks passed.
- Code review found no actionable issues in state isolation, stale async operations, text escaping, blob URL cleanup, or initialization.
- Browser verified About save and persistence after reload, resume attachment and persistence after reload, download, and removal.
- Temporary About text and resume were restored/removed after checking; the test download was deleted after matching its contents to the test fixture.
- Both photo assets loaded. The mobile profile used a single column with no horizontal document overflow.

Previews: artifacts/showcase/profile-desktop.png and artifacts/showcase/profile-mobile.png.
