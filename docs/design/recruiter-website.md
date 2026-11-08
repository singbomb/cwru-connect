# Separate recruiter website

The recruiting prototype runs at `http://127.0.0.1:4174/` with `npm run demo:recruiter`. The student prototype continues at port 4173. They have separate entry points, controllers, navigation, fixture records, and origin-scoped browser state. Shared local fonts, icons, and photographs keep the visual identity consistent. Neither site synchronizes records with the other.

The visual system follows the student website: CWRU Blue (#003071), Figtree, white surfaces, muted gray page backgrounds, restrained borders, and clear primary actions. Recruiter navigation prioritizes Overview, Postings, Applicants, Messages, and Lab profile.

## Working interactions

- Create and edit positions with Draft, Open, Paused, and Closed states.
- Filter postings by status and open their applicant lists.
- Search applicants by name or skill, and filter by position or review stage.
- Review candidate details, availability, application responses, and fictional resume summaries.
- Change review stages manually and save private recruiting notes.
- Save message drafts, including new conversations opened from applicant profiles. No message is sent.
- Edit lab details and the recruiting contact.

Changes persist in localStorage under `cwru-recruiting-standalone-v1`. There is no authentication, server persistence, private file upload, real applicant data, or production authorization. The footer identifies the fictional prototype, while messaging and resume previews explain their practical limits at the point of use.

## Verification

Browser checks covered creation and publication of a new position, persistence after reload, candidate stages, private notes, resume preview, message drafts, lab profile edits, applicant filters, empty results, and navigation from a conversation to a candidate excluded by prior filters. Desktop and mobile layouts were inspected; overview and applicant pages had no document-level horizontal overflow. Postings use an internally scrollable table on small screens.

`node scripts/validate-recruiter.mjs` checks storage isolation from fixtures, persistence, filtered results, derived counts, empty states, user-content escaping, and draft-only messaging. Existing 131 simulation checks and 51 requirement checks pass. These are local prototype checks, not confirmation of production recruiting functionality.
