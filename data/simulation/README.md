# Fictional recommendation simulation

Every record is synthetic. Names, labs, authority checks, openings, schedules, and recruiting states are invented for this demonstration. The CWRU scope is a product constraint, not evidence that these fictional labs exist. No real resumes, student records, messages, patient information, or recruiting outcomes are included. Contact addresses use `example.invalid` and must never be used for delivery.

The fixed snapshot date is **October 27, 2026**. The deterministic seed identifier is `20261027`; fixture generation uses explicit authored records rather than a random population model. Running the generator twice produces identical JSON/CSV bytes. These fixtures are useful for demonstrations and behavior checks, not statistical inference or claims about campus supply.

## Files and regeneration

From the repository root:

```sh
node scripts/generate-simulation.mjs
node scripts/validate-simulation.mjs
```

| File | Use |
| --- | --- |
| `dataset.json` | Complete browser-ready dataset with metadata and normalized entity arrays |
| `students.json`, `labs.json`, `openings.json`, `people.json` | Individual entity exports |
| Matching `.csv` files | Spreadsheet-readable exports; nested arrays/objects are JSON within quoted cells |
| `scenarios.json` | Named demonstrations with student IDs and option overrides |
| `sample-recommendations.json` | Default ranked output for each of the eight student personas |
| `scenario-results.json` | Recomputed output for each authored scenario |
| `validation-report.json` | Receipt from behavioral and integrity checks |

Counts: 8 students, 24 labs across six CWRU school categories, 18 openings, 30 PIs/recruiters, and 10 demonstration scenarios. There are no fabricated ratings, testimonials, publications, placements, or messages.

## Recommendation contract

```js
import { recommend } from './demo/recommender.mjs';
const result = recommend(dataset, dataset.students[0], {
  paidOnly: false,
  beginnerOnly: false,
  maxWeeklyHours: 10,
  topics: ['genetics', 'computational biology'],
  feedback: { dismissed: ['lab:lab-02'], contacted: [] },
  saved: [],
  limit: 6,
});
```

The returned object contains `opportunities`, `labs`, `people`, `excluded`, `rankingVersion`, `asOf`, and `synthetic`. Each ranked result provides `id`, `type`, `title`, `labId`, `labName`, `status`, `action`, `reasons`, `caveats`, `evidence`, `score`, `components`, and `synthetic`. Optional opening/person fields add context. `excluded` records opening constraint failures for demonstration inspection.

Scores are internal deterministic ordering values, **not match percentages or probabilities of selection**. Do not display them as confidence, eligibility guarantees, or measured quality. The demo has no trained model or collaborative filtering. Its two product feeds are (a) labs/openings, retaining separate arrays for actionable openings and research exploration, and (b) authorized people. Student-peer discovery remains outside this R1 simulation.

Feedback keys are `opening:ID`, `lab:ID`, and `person:ID`. Dismiss and already-contacted hide that exact item in its feed. Clearing both arrays resets feedback. Saving contributes one bounded preference point and cannot override an opening constraint. Feedback persistence is a browser responsibility, not the scorer's.

Eligibility and permitted actions are computed before per-feed feedback hides items. Dismissing an opening does not remove the related lab or recruiter, and dismissing a lab does not remove its authorized recruiter; each item has its own explicit control. Dismissal never changes whether the underlying opening is current or fits the student's constraints.

The module rejects invalid option values with `TypeError` or `RangeError` before ranking. `asOf` must be a real `YYYY-MM-DD` calendar date; maximum weekly hours must be a finite number from 0 to 168, maximum commitment from 0 to 120 months, and result limit an integer from 1 to 1000. Weights must use the documented keys and finite nonnegative numbers. Topics, schedules, saves, and feedback require arrays of nonempty strings; schedule blocks and feedback keys must follow the supported formats. Duplicate topics are normalized so they cannot inflate relevance. These are defensive demo API bounds, not approved production policies.

## Proposed rules and limitations

1. Check publication state, confirmed lab ownership, closing date, and the proposed 30-day reconfirmation window. At the deadline or 30-day boundary the opening is expired.
2. Check explicit eligibility: academic year, required experience, confirmed required skills, time commitment, and known schedule. Unknown data fails the corresponding active constraint. Paid-only excludes both unpaid and unknown compensation. Beginner-only requires an explicit beginner-friendly field.
3. Rank surviving candidates using `rules-demo-v1`: 5 points per shared topic, 3 per confirmed transferable skill, 2 per declared learning goal supported by training, and 1 for an explicitly saved item. These weights are illustrative, uncalibrated defaults and remain configurable.
4. Show evidence-based reasons and caveats. When no supported overlap exists, label the item exploratory and invite profile enrichment. Do not invent a strong-match label.
5. Suggest people only when affiliation, lab-specific authorization, claimed account, and claimed lab are all true. Inquiry previews additionally require both lab and person inquiry consent. Otherwise show a matching opening or research exploration action.

Lab and people status labels are recomputed from current opening lifecycle and expiry. A cached lab claim of a confirmed opening falls back to inquiry-only when inquiry consent exists, or unknown otherwise, when no current confirmed opening remains. A still-active opening that fails a student's constraints is disclosed separately from missing or expired inventory.

Student availability constrains **actionable openings**. Research exploration can still include relevant closed or unknown-status labs, with explicit caveats and an Explore action. Explicit paid-only or beginner-only filters restrict lab/people discovery to labs with a corresponding eligible active opening. This preserves the PRD's separate explore-versus-apply behavior. A real product should confirm this filter wording in usability review.

The opening gate reads confirmed manual `skills` and `resumeFacts` whose `confirmed` flag is true. Unconfirmed extracted facts are retained as a fixture but ignored. Names, email, photos, GPA, private messages, and inferred sensitive traits are unused. No prestige, publication volume, paid promotion, popularity, or automatic applicant rejection enters ranking.

No external application or message is submitted. The local demo can preview an action, but it cannot establish authenticated access, real recruiting authority, a submission receipt, a human response, or an actual start. Behavioral tests establish only fixture invariants. Real relevance evaluation requires independently labeled examples, beginner coverage review, constraint-error analysis, and a pilot comparison against a topic baseline with explicit denominators.

## Data dictionary

| Entity | Key fields | Meaning |
| --- | --- | --- |
| Metadata | `asOf`, `seed`, `rankingVersion`, `weights`, `topics`, `scheduleBlocks`, `scheduleLabels` | Frozen date, generator identifier, rule version, supported vocabularies, and readable schedule labels |
| Student | `id`, `name`, `label`, `year`, `interests`, `skills`, `learningGoals` | Fictional persona and confirmed/manual matching inputs; names and labels do not score |
| Student availability | `maxWeeklyHours`, `scheduleBlocks`, `commitmentMonths`, `experienceMonths` | Maximum weekly time, available time blocks, maximum duration, and prior experience used by opening checks |
| Student resume | `resumeStatus`, `resumeFacts` | Optional import state; extracted facts carry `kind`, `value`, `confirmed`, and `source` |
| Student preferences | `preferences.paidOnly` | Explicit hard compensation constraint; options can override it |
| Lab | `school`, `department`, `institution`, `scopeVerified`, `claimed` | Fictional ownership and CWRU-only scope fixtures; not real institutional verification |
| Lab discovery | `topics`, `preferredSkills`, `learnableSkills`, `description` | Authored research context and supported training used for explanations |
| Lab status | `recruitingStatus`, `acceptsInquiries`, `scheduleKnown`, `lastCheckedAt`, `provenance` | Recruiting distinction, inquiry permission, missing-data disclosure, and synthetic source label |
| Opening | `labId`, `title`, `tasks`, `training`, `requiredSkills`, `preferredSkills`, `learnableSkills` | Structured role; required prerequisites gate eligibility while preferences/training affect ordering |
| Opening constraints | `allowedYears`, `requiredExperienceMonths`, `beginnerFriendly`, `minWeeklyHours`, `requiredBlocks`, `commitmentMonths`, `compensation` | Confirmed requirements; `null` means unknown; empty `requiredSkills`/`requiredBlocks` means no listed prerequisite/fixed block |
| Opening lifecycle | `status`, `confirmedAt`, `closesAt`, `applicationRoute` | Published/draft/paused/closed lifecycle, date checks, and simulation-only application route |
| Person | `labId`, `name`, `role`, `affiliationVerified`, `authorized`, `accountClaimed`, `acceptsInquiries`, `email` | Lab-specific authority and contact route fixtures, including deliberately invalid cases |
| Scenario | `id`, `studentId`, `description`, `options` | Reproducible demonstration case and rule overrides |
| All entity rows | `synthetic: true` | Required fictional-data marker |

`scheduleBlocks` use weekday plus `am`/`pm`, such as `mon_pm`; `metadata.scheduleLabels` provides display copy. Dates are UTC day boundaries for deterministic simulation, not a final production timestamp contract. Production needs timezone-aware instants and server-side rechecks on action.
