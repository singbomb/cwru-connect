# Research Connect Unslop proposal

Status: Audit complete; direction confirmation required by the requested skill. No website source files changed.

Method: Unslop by Damir Sokolovsky (@heydamir), licensed CC BY 4.0.
Source: https://github.com/heydamir/unslop/blob/main/skills/unslop/SKILL.md

## Audit

Classification: Light slop; use polish mode and retain the existing palette, Public Sans, section order, layout, and visual identity.

- Typography: headings, titles, buttons, and metadata use many weights from 600 to 750; reduce hierarchy to regular, medium, and limited semibold.
- Spacing: CSS uses scattered 5px, 7px, 9px, 10px, 14px, and 18px values; establish a 4px rhythm while retaining optical adjustments where needed.
- Details: dark group-count badges compete with section headings; use quiet inline counts.
- Details: boxed hours, compensation, and commitment compete with the actual opening; present practical fields as a readable metadata line.
- Icons: the evidence chain icon adds decoration to a sentence whose purpose can be explained in text; remove it and normalize remaining action icons.
- Copy: the headline "Research that fits your next step." is generic; proposed replacement: "Find undergraduate research at CWRU".
- Copy: shorten group descriptions while retaining distinctions between confirmed openings, lab exploration, and recruiting permission.

The interface already avoids gradients, glows, emoji decorations, fabricated testimonials, and looping decorative motion. Preserve visible focus, readable touch targets, synthetic-data notices, preview wording, and matching caveats.

## Direction

Product: Help CWRU students explore labs, current research openings, and recruiting contacts.
Character: Academic, practical, approachable.
World: A university research catalog; retain the existing navy, blue, white surfaces, and Public Sans.
Moments: Let the leading opening and its concrete matching evidence carry the visual emphasis.
Signature: A consistent, plain-language research-match line connecting student interests or skills to each suggestion.

## Proposed implementation

1. Normalize spacing across existing components to a 4px rhythm; verify desktop and mobile alignment.
2. Preserve the palette and quiet competing count and metadata treatments; verify contrast and status labels.
3. Simplify evidence icons and standardize action-icon size and stroke; verify accessible names remain intact.
4. Apply the specific headline and shorter descriptions; verify no new claims or capabilities are introduced.
5. Reduce weights to 400, 500, and selective 600; verify long research titles still wrap.
6. Retain the existing layout and section order; verify profile disclosure and discovery grids at responsive widths.
7. Refine counts and practical metadata without adding decoration; verify opening actions remain prominent.
8. Retain real product content without adding a hero illustration; this is an application screen in polish mode.
9. Retain useful interaction feedback and reduced-motion support; verify saving, filtering, previews, and feed switching.

Validation: Run npm run validate and npm run verify:docs; inspect browser layouts and interactions; review changed code before reporting completion.
