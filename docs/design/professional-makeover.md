# Professional makeover (November 2026)

Site-wide restyle toward a quiet, institutional job board. All styles now live in `demo/site.css`, which replaces `styles.css`, `shell.css`, and `profile.css`.

## Audit before the change

- 45 hard-coded hex colors across three stylesheets, 10 different border radii, 17 font sizes.
- 26 uses of semibold (600) weight; most interface text at 12–13px.
- Job cards led with the research area ("Genetics") instead of the role; metadata ran together as loose text.
- Details opened inline above the results and pushed the list down.

## System

| Token group | Values |
| --- | --- |
| Brand | `--brand #003071`, hover `#00245a`, tint `#eef3f9`, line `#c8d5e8` |
| Neutrals | background `#f5f6f8`, surface white, text `#18212c` / `#4a5462` / `#6b7480`, lines `#e3e6eb` / `#cdd2d9` |
| Status | open (green dot), accepting inquiries (blue dot), unknown (amber dot), not recruiting (gray dot) |
| Type | Source Serif 4 at 400 for page titles; Public Sans at 400 and 500 for everything else. No heavier weights. |
| Radius | 4px tags, 8px controls, 12px cards, pill chips |
| Elevation | three shadows: resting card, hovered card or menu, drawer |

## Component changes

- **Header:** white with a hairline border, sticky; active page underlined in CWRU blue.
- **Hero:** darkened lab photo, serif headline, search field, interest chips, recommended position card.
- **Position card:** role title first, then lab and school, then hours, pay, duration, area, and beginner-friendly tags; one match reason; footer with status, deadline, overflow menu (hide, mark as contacted), and View position.
- **Details:** right-side drawer with backdrop. Escape and backdrop click close it; focus is trapped inside and returned to the trigger.
- **Filters:** flat panel with chevron disclosures; research interests and time blocks are toggle chips.
- **Profile and messaging:** same card, type, and button system; copy shortened to plain statements.
- **Footer:** site name, one-line description, prototype notice, and page links.

## Verification

Checked at 1440×900 and 390×844 on every route with Playwright: no console errors, computed font weights limited to 400 and 500, save, overflow menu, drawer open/close, hero search, and topic filters all work.
