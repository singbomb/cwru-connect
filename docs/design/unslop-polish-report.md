# CWRU Connect: approved Unslop polish

Completed November 7, 2026, after the user approved the direction in unslop-current-audit.md.

## Direction

Product: Help CWRU students find research jobs, discover labs, and meet research contacts.
Character: Collegiate, practical, welcoming.
World: A campus recruiting service using university blue and Public Sans.
Moment: The existing blue research-match panel and its suggested role.
Signature: Plain research-match evidence connecting student interests or skills to each opportunity.

## Nine passes

1. Spacing: Normalized small margin, padding, and gap values to the established 4px rhythm. Preserved deliberate 2px adjustments, icon dimensions, and 44px control targets. Desktop card actions retain their shared alignment.
2. Color: Preserved CWRU Blue #003071, Dark Blue #09143a, and existing semantic colors. Removed the fixed 620px gradient; the recommendations container now owns its solid ground, so the boundary follows section content.
3. Icons: Replaced Home text arrows with matching 18px, 1.5-stroke line icons. Matched result arrows, bookmarks, and disclosure strokes; removed the decorative board arrow and evidence chain icon while preserving text and accessible labels. The profile symbol and inbox illustration retain their distinct functional sizes.
4. Copy: Changed the headline to "Find your place in CWRU research", the panel title to "Research matched to your interests", and its footer line to "Labs and opportunities at Case". Kept existing role data and feature scope.
5. Type: Reduced the Home headline to weight 500 and tracking -0.03em. Set mobile headline size to 40px and adjusted text measure for the specific heading. Removed negative tracking from small initials marks.
6. Layout: Kept the split Home composition, navigation, profile position, and recommendations below the landing section. Kept the established mobile stack and all directory routes.
7. Details: Preserved quiet counts, consistent outlined opening actions, Save state, Show more / Show less, and keyboard focus. Centered the research-match action arrow within its card.
8. Visuals: Retained the actual research-role preview and interest chips. No generated image, new imagery, or image prompt was needed for this polish-mode pass.
9. Motion: Preserved useful save and feed feedback, reduced-motion support, and existing restrained hover behavior. Added no entrances or decorative motion.

## Verification

- 131 simulation checks passed.
- 51 documentation traceability/source-integrity checks passed.
- Modified renderer passed JavaScript syntax checking.
- Code review found no actionable issues; its source review was separate from the browser checks below.
- Browser verified official blue on the header, weight 500 on the headline, and no background image on the Home shell.
- Browser verified Show more / Show less, job search, Save toggling, opening details and close, directory navigation, and neuroscience search returning three labs.
- Desktop and mobile had no horizontal document overflow. Mobile computed headline size is 40px with a single-column hero.
- Desktop and mobile previews are saved in artifacts/showcase/unslop-polish-desktop.png and artifacts/showcase/unslop-polish-mobile.png.

No feature, recommendation-rule, source-data, or navigation change was made in this pass. The source files changed are demo/index.html, demo/render.mjs, demo/styles.css, and demo/shell.css.

Design method: Unslop by Damir Sokolovsky (@heydamir), CC BY 4.0.
https://github.com/heydamir/unslop
