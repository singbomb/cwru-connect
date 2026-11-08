# Centered Find labs search

Updated November 8, 2026.

Find labs now opens on a centered search form rather than a populated directory. The Advanced search disclosure offers School, Department, Research area, Recruiting status, and Saved labs only. Department choices narrow to the selected school. Submitting snapshots the current query and filters, closes the advanced disclosure, compacts the form, and shows matching labs below it. Keyword text and advanced filters combine with AND semantics.

Browse all labs clears constraints and displays the directory. Reset search clears the form and returns to the initial state. Leaving and reopening Find labs resets to the centered starting page and restores all department options. Jobs and Network are unchanged.

Implementation: demo/lab-search.mjs and demo/lab-search.css, with markup in demo/index.html, routing hooks in demo/app.mjs, and a lab-specific empty state in demo/render.mjs.

Verification:
- 131 simulation checks passed.
- 10 focused assertions passed with `node scripts/validate-lab-search.mjs`.
- JavaScript syntax and diff checks passed; code review found no actionable issues.
- Browser confirmed no results are shown initially, keyword search, combined school/department filters, dependent department choices, saved-only filtering and unsave-to-empty behavior, reset, browse-all (24 labs), and route reentry.
- Test saved lab was removed after verification.
- Mobile advanced fields stack in one column with no horizontal document overflow.
- Previews: artifacts/showcase/lab-search-landing.png and artifacts/showcase/lab-search-mobile.png.
