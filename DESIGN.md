---
name: "Research Connect local demo"
description: "Observed design system for the synthetic research recommendation demo."
colors:
  navy: "#123b53"
  navy-deep: "#0b2b3e"
  blue: "#175d91"
  blue-hover: "#104a77"
  blue-tint: "#edf5fb"
  ground: "#f2f5f7"
  surface: "#ffffff"
  text: "#172b39"
  muted: "#50616f"
  line: "#d5dee5"
  line-strong: "#8b9da9"
  green: "#255b43"
  green-tint: "#eaf3ed"
  amber: "#75511b"
  amber-tint: "#fbf2e0"
  danger: "#942d31"
  danger-tint: "#fff1f1"
  focus: "#bd590b"
typography:
  headline:
    fontFamily: '"Public Sans", Arial, sans-serif'
    fontSize: "1.875rem"
    fontWeight: 720
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: '"Public Sans", Arial, sans-serif'
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.35
  result-title:
    fontFamily: '"Public Sans", Arial, sans-serif'
    fontSize: "1.1875rem"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  section:
    fontFamily: '"Public Sans", Arial, sans-serif'
    fontSize: "1.0625rem"
    fontWeight: 720
    lineHeight: 1.35
  body:
    fontFamily: '"Public Sans", Arial, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: '"Public Sans", Arial, sans-serif'
    fontSize: "0.8125rem"
    fontWeight: 650
    lineHeight: 1.5
  button:
    fontFamily: '"Public Sans", Arial, sans-serif'
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.3
  metadata:
    fontFamily: '"Public Sans", Arial, sans-serif'
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
  brand:
    fontFamily: '"Public Sans", Arial, sans-serif'
    fontSize: "1.375rem"
    fontWeight: 750
    lineHeight: 1.5
    letterSpacing: "-0.035em"
rounded:
  tag: "3px"
  control: "4px"
  sheet: "12px"
spacing:
  tight: "4px"
  compact: "6px"
  small: "8px"
  control-gap: "10px"
  inset-small: "12px"
  action-top: "14px"
  inset: "16px"
  row: "18px"
  section: "20px"
  sheet-inline: "22px"
  mobile-gap: "24px"
  column-gap: "28px"
  shell-inline: "32px"
  shell-bottom: "48px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.surface}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  button-primary-hover:
    backgroundColor: "{colors.blue-hover}"
    textColor: "{colors.surface}"
  button-primary-active:
    backgroundColor: "{colors.navy-deep}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.blue}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  button-secondary-selected:
    backgroundColor: "{colors.blue-tint}"
    textColor: "{colors.blue-hover}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "10px 8px"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "9px 10px"
    width: "100%"
  button-save:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    padding: "8px"
  result-sheet:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "0"
  result-row:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.sheet}"
    padding: "16px"
  evidence:
    textColor: "{colors.navy}"
  status-open:
    backgroundColor: "{colors.green-tint}"
    textColor: "{colors.green}"
    rounded: "{rounded.tag}"
    padding: "3px 7px"
  status-inquiry:
    backgroundColor: "{colors.blue-tint}"
    textColor: "{colors.blue}"
    rounded: "{rounded.tag}"
    padding: "3px 7px"
  status-unknown:
    backgroundColor: "{colors.amber-tint}"
    textColor: "{colors.amber}"
    rounded: "{rounded.tag}"
    padding: "3px 7px"
---

# Design System: Research Connect local demo

## Overview

**Creative North Star: "The Research Catalog"**

The Research Catalog is the observed visual system of the local recommendation demo. It combines the user-selected university catalog direction with the later request for a sharper LinkedIn/Indeed feel: a deep blue shell, cool ground, white sheets, compact Public Sans typography, and conventional recruiting controls. The system favors readable evidence and clear actions at a useful working density. Current openings form a short list of practical roles; lab and people discovery use smaller cards so each feed has a distinct rhythm.

This record describes demo/index.html, demo/styles.css, demo/render.mjs, demo/feed-motion.mjs, and demo/app.mjs as shipped on October 27, 2026. It applies to this local demo only. Final naming, institutional branding permission, logo, typography, and the production visual identity remain open in PRODUCT.md. The only shipping visual asset is the local Public Sans variable font, accompanied by its SIL Open Font License; the demo ships no raster imagery.

**Key Characteristics:**
- Compact professional sans hierarchy with sentence-case controls.
- Separate opening cards and compact discovery grids on a cool neutral ground.
- Subject-first opening titles and initials identify each result before its supporting fields.
- Plain research evidence appears within the result it explains.
- One lead opening action, quiet bookmark saves, and native disclosures organize the next steps.
- Text labels accompany recruiting states and local feedback actions.

## Colors

A restrained blue primary family sits above cool neutral sheets; green, amber, and red communicate labeled states rather than decorative variety. Frontmatter preserves the actual CSS custom-property names and values.

### Primary

- **Catalog Navy** (`navy`): header ground; **Deep Navy** (`navy-deep`): pressed primary actions and selection text.
- **Action Blue** (`blue`): primary actions, links, selected feed controls, and checkbox accent; **Action Blue Hover** (`blue-hover`): hover and selected secondary text.
- **Blue Tint** (`blue-tint`): initials marks, research topics, saved and hover states, inquiry status, and brief arrival feedback.

### Secondary

- **Opening Green** (`green`, `green-tint`): current-opening state text and ground.
- **Uncertainty Amber** (`amber`, `amber-tint`): recruiting-unknown state text and ground.
- **Error Red** (`danger`, `danger-tint`): invalid-field text and data-load failure ground.
- **Focus Orange** (`focus`): keyboard focus outline across interactive controls.

### Neutral

- **Cool Ground** (`ground`) and **White Surface** (`surface`): page and resting sheets.
- **Ink** (`text`) and **Muted Slate** (`muted`): primary and supporting text.
- **Fine Divider** (`line`) and **Control Stroke** (`line-strong`): sheet boundaries, section dividers, controls, and feed baseline.

**The Labeled State Rule.** Recruiting color accompanies an explicit text label; color does not replace the state name.

## Typography

**Display Font:** No separate display face is used.  
**Body Font:** Public Sans, with Arial and sans-serif fallbacks.  
**Label/Mono Font:** The same Public Sans stack; no separate mono face is used.

**Character:** A compact professional sans with firm title weights and restrained tracking. The variable font is loaded locally with weights 100–900, normal style, and swap display; the interface uses tabular numbers and disables synthetic font styles.

### Hierarchy

- **Headline:** the frontmatter headline role styles the page heading; at widths up to 900px it reduces to 1.625rem.
- **Title:** preview headings retain the title role. Clickable result subjects use the result-title role, reducing to 1.125rem at 700px and below. The leading opening uses 1.25rem, reducing to 1.1875rem on small screens. Opening role labels follow the subject; lab affiliation follows the role.
- **Section:** filter headings use the section role; result-group headings use 1.125rem, weight 750, and -0.02em tracking. Compact count labels sit beside each group heading.
- **Body:** the root body role establishes the base rhythm. Most working UI copy uses 0.8125rem; the intro, empty-state help, and larger disclosure summaries use 0.875rem.
- **Label:** field labels use the label role; action labels use the button role. Button labels reduce to 0.75rem at 700px and below.
- **Metadata:** status notes, practical metadata, tags, caveats, and the demo notice use the compact metadata size; status labels add weight 700.
- **Brand:** the wordmark is text in Public Sans using the brand role, reducing to 1.125rem on small screens.

**The One Sans Rule.** Use Public Sans with the established Arial and sans-serif fallbacks throughout this demo.

## Layout

The shell has a maximum width of 1324px and a 72px minimum header height. The default workspace uses a 290px filter column, a fluid results column, a 28px gap, and 32px horizontal shell padding. Filters and results align at the top. The working rhythm retains 20px filter sections and uses 16px result-card insets, 12px gaps between cards, and 28px between feed groups.

Current openings appear first, with two cards visible and remaining displayed openings behind a native expansion. Each group displays at most the first six matches and states when that limit applies. At 1050px and above, opening cards use flexible content beside a 196px footer/action column, with a 16px gap and 12px by 16px card padding. Lab and people discovery instead use two equal columns when the research-feed container is at least 600px wide; their footers align at the bottom of the card. This condition follows the available feed width, including beside the sidebar.

At 900px and below, the filter column reduces to 260px, shell padding and column gap reduce to 22px, and the header descriptor disappears. At 700px and below, the workspace becomes one column with 16px side padding and a 24px gap. A native disclosure places the profile and filters above the results and starts collapsed; the filter options form two columns. Result cards use 14px padding, 40px initials marks, and wrapping footer actions. Discovery cards become one column when the feed container is narrower than 600px. Long result titles and preview values wrap rather than expanding the card.

Help copy has observed limits of 66ch in empty states, 70ch in previews, and 72ch in supporting disclosures. Interactive buttons, fields, checkbox rows, and desktop disclosure summaries provide at least 44px height; the mobile filter summary provides 52px.

## Elevation & Depth

The demo is flat: it declares no box shadows. The cool page ground, separate white result cards, tinted identity and state labels, and fine borders establish grouping. The first opening with matching evidence gains an Action Blue border and a filled action; card hover or focus strengthens its border. Preview content uses a primary-blue border to distinguish the active inline detail panel. No modal overlay is used.

**The Dividers Carry Depth Rule.** Separate resting surfaces with tone and fine borders; the shipped demo uses no box shadows.

## Shapes

Compact tags, practical-field spans, and recruiting labels use the tag radius. Inputs, actions, and lab initials use the control radius; people initials use the sheet radius. Filter, result, preview, and error cards retain the sheet radius. The results wrapper is transparent and unrounded so the individual cards provide its boundaries. The active feed control adds a 3px lower rule. Native checkbox, select, and disclosure affordances remain recognizable.

## Components

### Buttons

Conventional controls retain a 44px minimum height, firm sentence-case labels, and the control radius. Shared primary buttons use Action Blue with white text, darken on hover, and reach Deep Navy while pressed. Shared secondary buttons retain white ground and Control Stroke. In the feed, only the leading opening receives a filled action; other opening actions are outlined, while lab and people actions use text with an arrow. The arrow advances 3px on hover or keyboard focus. Bookmark saves sit beside the identity, with an explicit Save or Saved label and `aria-pressed`; the saved icon fills blue and its ground gains Blue Tint. Dismiss and Already contacted live in the native More disclosure. Shared quiet actions retain transparent ground with muted text and an 8px horizontal inset. Disabled controls keep their shape, use opacity 0.55, and show a not-allowed cursor.

### Chips

Profile tags are static, compact neutral labels with a 3px by 7px inset and the tag radius. Opening hours, compensation, and commitment appear as separate practical-field spans; lab and people cards use plain school metadata and Blue Tint research-topic labels. Recruiting labels retain green, blue, or amber semantic assignments and explicit state text. These labels are not filter buttons. Research-interest controls use native checkbox rows.

### Cards / Containers

Filters remain white bordered sheets with the sheet radius. Results use separate white bordered cards. Each card starts with an initials mark, clickable subject, supporting role or affiliation, and bookmark save. Opening subjects precede role labels; lab and people cards add research-topic labels. Practical metadata and plain evidence follow, with explicit recruiting state, demo provenance, and next action in the footer. The leading opening is selected only when the first visible opening has matching evidence. Two openings show initially, with the rest of the displayed set in a native disclosure; its expanded state survives a feed refresh when that disclosure is still present. Lab and people cards use their discovery grids. Empty results keep a white bordered container and offer explanatory recovery copy; saved-only emptiness explains that strict filters can remove saved items from view.

### Inputs / Fields

Selects and the numeric-hours input use white ground, Control Stroke, the control radius, a 9px by 10px inset, and the compact label size. Hover changes the border to Action Blue. Invalid hours use Error Red, an explicit alert, and preserve the previous results. Checkboxes use an 18px native control with Action Blue accent, surrounded by a 44px label row.

### Navigation

The deep blue header uses a white text wordmark and a pale data-download link. Feed switching uses two plain buttons in a labeled group. The selected button has Action Blue text and a matching lower rule; selection is exposed with `aria-pressed`. The saved-only checkbox sits beside the feed switch and wraps below it when space requires.

### Recommendation evidence

Evidence sits directly inside each card as plain compact copy with a small link-shaped icon, without a tinted box. A visually hidden "Why this appears" label preserves its meaning for assistive technology. The card shows the first explanation; the inline preview exposes the fuller matching evidence. Recruiting uncertainty remains in a separate caveat line. The pattern communicates relevance without a probability or score visualization.

### Inline preview and support states

A white, blue-bordered preview opens above results, receives focus, and states that nothing is sent or submitted. Closing returns focus to its trigger when available. Native disclosures hold interests, availability blocks, exclusions, and recommendation help. Loading uses a readable status; load failure uses a tinted alert panel and reload action. Result counts and local feedback updates use a polite live status.

### Focus and motion

Keyboard focus uses a 3px Focus Orange outline with a 3px offset. A skip link becomes visible on focus. Feed motion responds to state changes; the initial render has no entrance choreography. The helper measures at most the first 12 new rows, ignores offscreen or hidden rows, and moves retained cards only when their vertical displacement is greater than 2px and less than 500px. Those bounded FLIP-style moves and new-card color feedback use 220ms with `cubic-bezier(0.16, 1, 0.3, 1)`. Dismiss or Already contacted uses a 120ms, 12px exit; saving acknowledges the bookmark with a 160ms scale pulse. Border, save color, and action-arrow feedback use 140ms ease-out transitions. Reduced motion removes movement, the save pulse, and those transitions; new-card feedback uses only a 100ms background-color change. The old 320ms results-refresh CSS class remains unused. Preview scrolling is immediate.

## Do's and Don'ts

These guardrails apply to the local demo. No additional visual bans are inferred from the chosen catalog direction.

### Do:

- **Do** keep the observed Public Sans hierarchy and sentence-case labels for this demo.
- **Do** keep recommendation evidence, practical metadata, and the next action together in each result.
- **Do** preserve explicit state labels, visible keyboard focus, labeled inputs, and recovery copy.
- **Do** keep the synthetic-data notice and preview-only wording visible in the demo workflow.

### Don't:

- **Don't** imply an opening, contact permission, or selection from research relevance alone.
- **Don't** turn a local preview or a browser preference into wording that claims a real message or application was sent.
- **Don't** present these demo tokens as an approved production or institutional identity.
