# CWRU Connect: Unslop audit

Status: Audit complete; awaiting the skill's direction checkpoint. Website source files are unchanged by this audit.

Method: Unslop by Damir Sokolovsky (@heydamir), CC BY 4.0.
Skill: /Users/singbomb/.codex/skills/unslop/SKILL.md

## Assessment

Light slop: polish mode. Retain CWRU Blue #003071, Dark Blue #09143a, the Spartan mark, Public Sans, existing navigation, the split Home landing section, and recommendations below it. Retain consistent outlined opening buttons and aligned Save actions. No generated imagery or new features are proposed.

## Findings and concrete refinements

1. Home headline, feature-panel heading, and footer tagline are generic. Replace the headline with "Find your place in CWRU research", the panel heading with "Research matched to your interests", and its footer tagline with "Labs and opportunities at Case". Preserve role data and user interests.
2. Home headline uses weight 600, tracking -0.05em, and a 48px mobile size. Use weight 500, tracking -0.03em at display sizes, and 40px on mobile; adjust its text measure to suit the specific headline.
3. Small initials marks use negative tracking. Set tracking to 0 below 16px, including the identity marks. Keep meaningful title hierarchy.
4. Action arrows combine text glyphs and SVG icons with different sizes; the board arrow and chain-link evidence icon add little information. Use the existing line-icon style at 18px with 1.5 stroke for comparable actions and remove decorative icons without changing labels or accessible names.
5. Controls and metadata use scattered 5px, 7px, 9px, 10px, and 14px gaps/insets. Normalize affected visible spacing to 4px steps, retaining 44px touch targets and deliberate 2px optical adjustments.
6. Home's ground switches at a hardcoded 620px rather than its section boundary. Give the landing section and recommendations their own solid surfaces so the color transition follows the content at every viewport.

Already satisfactory: official brand palette, plain wordmark and logo, clear navigation, solid colors, quiet counts, realistic source fixtures, consistent opening actions, visible keyboard focus, and restrained interaction motion. No glowing surfaces, gradient text, fabricated testimonials, or decorative looping animations were found.

## Direction

Product: Help CWRU students find research jobs, discover labs, and meet research contacts.
Character: Collegiate, practical, welcoming.
World: A campus recruiting service, using the existing university blue and Public Sans.
Moments: Keep the existing blue research-match panel and its actual suggested role as the visual focus.
Signature: A consistent research-match line connecting a student's interests or skills to an opportunity.

## Proposed sequence and verification

1. Spacing: normalize affected component rhythm; verify alignment and touch targets.
2. Color: preserve university tokens; replace the fixed-height background transition with section surfaces.
3. Icons: normalize comparable action icons and remove redundant decoration; verify accessible labels.
4. Copy: use specific research language; preserve facts and feature scope.
5. Type: soften display weight/tracking and improve mobile scale; verify wraps.
6. Layout: retain section order and proportions; check desktop and mobile.
7. Details: retain consistent Save, outlined actions, and disclosure states.
8. Visuals: retain the existing product preview; no image generation.
9. Motion: retain useful feedback and reduced-motion support; remove nothing without a demonstrated issue.

After confirmation: run relevant checks, review modified code, compare the result to these findings, and save the final screenshot. Do not modify website source until the direction is confirmed, as required by step 4 of the invoked skill.

## Completion

The user approved the proposed polish. Implementation and verification are complete; see unslop-polish-report.md for the nine-pass record and preview paths.
