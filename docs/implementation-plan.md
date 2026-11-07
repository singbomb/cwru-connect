# CWRU Research Connect: implementation plan

Date: October 27, 2026  
Status: implementation proposal; production application and R1 release are not implemented or verified by this plan.  
Source: [PRD v0.1, live Google Doc](https://docs.google.com/document/d/1xFRbfjwTESThu7X-YE-R0yywrKZzx-UnhN8gT94wRq0/edit), captured in `docs/source-prd.txt`.  
Traceability: `docs/requirements-map.csv` maps all 51 functional requirements: 45 in R1 and 6 staged in R2.

## 1. Outcome and scope

Build a responsive CWRU-only research recruiting product in which an undergraduate can find relevant work, distinguish an opening from a lab profile, apply once, and see what happens next. Recruiters must be able to delegate recruiting, review applications, respond, and reconfirm availability with little repeated entry. The PRD annotations make unanswered outreach and faculty effort especially important: response visibility and delegated curation are central, not late additions.

The requested deliverable has two levels:

- **D0 demonstration:** fictional simulation records and an explainable recommendation demonstration, including both labs/openings and verified PI/recruiter suggestions. This proves specified behavior on controlled examples only.
- **R1 recruiting pilot:** all 45 R1 requirements, operational coverage, real authorized inventory, private data controls, and verified student and recruiter journeys. A working demonstration does not satisfy this release gate.

R2A mentorship reviews and R2B opt-in undergraduate connections have independent readiness gates. The PRD annotation about graduating students passing on opportunities informs R2B discovery and conversation requests; it does not authorize a public student directory or moving peer networking into R1. Native apps, standalone hospitals, other universities, automated applications, automated hiring decisions, journal prestige ranking, and paid boosts remain out of scope.

## 2. Decisions and assumptions

| Item | Planning position | Evidence or decision still needed |
|---|---|---|
| Product boundary | CWRU undergraduates and CWRU-owned labs across schools, including Medicine | Manual review for ambiguous organizational ownership; an address or cross-appointment alone is insufficient |
| Stack | Propose Next.js, TypeScript, React, and Supabase, as requested in this conversation | Record versions and service configuration in a technical design before scaffolding; no production schema is frozen here |
| D0 delivery | Interactive local demonstration plus simulation data, confirmed in this conversation | Dependency-free demo modules are separate from the proposed production web application |
| Visual direction | Impeccable shaping/review is part of this planning package | Record the selected direction in the companion brief; no rendered production screen is verified by a planning review |
| Hosting and styling | Vercel and Tailwind are proposed defaults | Confirm deployment account, region, costs, design tokens, and approved providers before deployment |
| Login | Proposed CWRU-domain email link plus separate undergraduate/authority verification | Institution-approved evidence, allowed domains, recovery procedure, and production email provider |
| Operations | Named recruiting, catalog, privacy, moderation, and support owners | Real people, escalation coverage, and response expectations before enrollment; follow-up due times and reminder limits are proposed policy decisions rather than reply guarantees |
| Proposed constants | 30-day opening reconfirmation; 10 MB PDF/DOCX resume limit | Confirm and version policies; deadline can expire an opening earlier |
| Resume processing | Manual entry always works; any extractor produces unconfirmed drafts | Provider choice, consent language, retention/use terms, file safety checks, deletion timing, backup policy |
| Ranking | Transparent content rules first; versioned weights remain provisional | Independently labeled examples and observed usefulness; no learned-quality or placement claim from simulation |
| Source ingestion | Minimal sourced facts with provenance and permitted lab corrections | CampusGroups curator workflow and participating PI permission; no automatic republishing assumption |
| Institutional status | Independent working product | No claim of endorsement, SSO agreement, credit approval, or partnership |

## 3. Proposed architecture and responsibilities

The paths below are proposed implementation locations, not files already delivered. Keep functions small, make authorization explicit at every data boundary, and preserve a dependable text-search route when parsing or recommendations fail.

| Layer / proposed location | Responsibility | Boundary |
|---|---|---|
| `src/app/(student)/` | Discovery, labs, openings, suggestions, saved/compare, profile, applications, messages, settings | Render only the authenticated student's permitted data; no client-supplied role is authoritative |
| `src/app/(recruiter)/recruiting/` | Lab confirmation, opening editor, applicant queue, outcomes | Each request resolves authorized lab scope on the server |
| `src/app/(operations)/operations/` | Verification, source corrections, reports/appeals, audit, health | Separate role-specific queues; routine moderators cannot browse private resumes |
| `src/server/auth/` and `src/server/policies/` | Session validation, undergraduate verification, lab membership, participant and support access | Server checks plus database row policies; active-role UI never grants extra access |
| `src/server/catalog/` and `src/server/openings/` | Canonical lab identity, provenance, publication attribution, listing lifecycle and freshness | Ingestion cannot overwrite confirmed recruiting state or invent a vacancy |
| `src/server/profiles/` and `src/server/resumes/` | Private profiles, consent, upload, processing status, confirmation, replacement/deletion | Raw file and extraction draft remain private; only confirmed facts reach matching |
| `src/domain/recommendations/` and `src/server/discovery/` | Typed retrieval, hard constraints, ranking, explanations, feedback, cache invalidation | No identity, GPA, sensitive traits, messages, popularity, or review-author inputs |
| `src/server/applications/` | Preview, transactional snapshot submission, idempotency, lifecycle, receipt | Revalidate session, authority, opening state, and file access at mutation time |
| `src/server/messaging/` and `src/server/notifications/` | Participant-scoped text, controls, notification outbox and retries | Email contains links and minimal context; no resume or sensitive message body |
| `src/server/privacy/`, `src/server/moderation/`, `src/server/analytics/` | Export/deletion, restricted reports, appeals, support reasons, minimal events | Logs exclude raw resumes and private message text; report identity stays restricted |
| `src/jobs/` | Safe extraction, expiry, reconfirmation, indexing, outbox delivery, reconciliation | Idempotent jobs with retry/dead-letter states; job failure cannot authorize a stale application |
| `supabase/` | Reviewed relational schema, row policies, private storage, local fixtures | Migrations and policies follow the technical design and access tests; no service credential in browser code |
| `tests/unit/`, `tests/integration/`, `tests/e2e/` | Domain invariants, authorization/lifecycle integration, student/recruiter journeys | Use synthetic fixtures before collecting real private data |

Candidate screen routes: `/sign-in`, `/verification`, `/discover`, `/labs/[labId]`, `/openings/[openingId]`, `/suggestions`, `/suggestions/people`, `/saved`, `/compare`, `/profile`, `/applications`, `/applications/[applicationId]`, `/messages/[conversationId]`, `/settings`, `/help`, `/recruiting/labs/[labId]`, `/recruiting/openings/[openingId]`, `/recruiting/applicants`, and scoped `/operations/*` routes. These are navigation proposals, not frozen public contracts.

Implementation references checked for this planning package: [Next.js server and client components](https://nextjs.org/docs/app/getting-started/server-and-client-components), [Supabase server-side clients for Next.js](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs), and the [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/). Use the current official setup instructions when implementing rather than treating this plan as a pinned API contract.

Conceptual entities are accounts and verification decisions; private student profiles and confirmed facts; resumes, consent and extraction drafts; canonical labs and scoped memberships; openings and confirmation history; sourced publications and permissioned student output; immutable submitted application facts and events; recruiter notes; conversations and participants; private saves and feedback; restricted reports, appeals and audit events. R2 adds isolated review-verification evidence and opt-in peer profiles. Review identity must never join the student-facing review response.

### Permission matrix

| Resource / action | Verified student | Authorized owner or delegate | Moderator | Administrator / authorized support |
|---|---|---|---|---|
| Catalog and current openings | Read community catalog | Read; edit assigned labs only | Read; content action within mandate | Curate with provenance and audit |
| Profile and resume | Own only; explicit application sharing | Selected receiving-lab application file only while access is valid | No routine access | Specific documented support purpose only; audit access |
| Application and status | Own; permitted student transitions | Assigned receiving lab; permitted recruiter transitions | No routine access | Scoped support reason; no unrestricted browse |
| Recruiter notes | No | Receiving-lab authorized members only | No | Specifically authorized support if policy permits; audit |
| Conversation | Explicit participant | Explicit authorized participant | Restricted report context only | Documented scoped support reason |
| Reports and appeals | Submit; own acknowledgment | Submit; permitted action notices | Assigned queue; protect reporter identity | Scoped queue and audit |
| Role assignment / lab ownership | Request verification | Cannot self-grant unrelated authority | No | Designated verifier; logged decision |
| R2 student reviews | Verified undergraduate eligibility only | Faculty/recruiter role grants no review access | Restricted moderation role | Segregated support scope; no reviewer identity in publication |

Multi-role accounts do not inherit broad access from the selected navigation mode. Test permissions at the API, database, file-download, export, and notification boundaries.

## 4. Sequenced delivery plan

Estimates assume one experienced full-time builder, small test inventory, no existing code, and operators available for decisions. D0 plus R1 is approximately **45–70 active builder days (9–14 five-day weeks)**, excluding institutional agreements, recruitment, provider approval, and calendar waiting. A new builder should allow additional learning time; these ranges are not promised dates. Real inventory and operations work can run in parallel but must satisfy release gates.

| Phase | Estimate | Depends on | Increment / exit evidence |
|---|---|---|---|
| D0: controlled recommendation demonstration | 1–2 days | PRD scope | Deterministic fictional data, two feeds, explainable results, scenario checks; clearly labeled simulation |
| P0: decisions, supply, and UX contract | 3–5 days | PRD and D0 observations | Technical decision record, Impeccable-reviewed flow brief, owner roster, source permission path, actual lab commitments |
| P1: identity and permission foundation | 5–8 days | P0 policy decisions | Verified roles, lab authority, private storage and policies; negative access and session-revocation tests pass |
| P2: catalog, publications, and openings | 6–9 days | P1 authorization | Curated labs, provenance, editing, full listing lifecycle, request-time expiry, job reconciliation |
| P3: profiles and resume assistance | 5–8 days | P1 privacy controls | Manual profiles and consented private upload; confirmation, failure recovery, replacement/deletion/revocation pass |
| P4: discovery, comparison, and both suggestion feeds | 6–9 days | P2 and confirmed P3 facts | Baseline search, strict filters, saves/compare, explanations, feedback/reset, beginner and no-match journeys |
| P5: applications and recruiter review | 7–11 days | P1–P4 domain state | Atomic idempotent snapshots and receipts, private queues/notes, lifecycle and actual-start records |
| P6: conversations and notifications | 5–8 days | P1, P2, P5 | Participant-scoped messaging, block/report/rate limits, visible sender, reliable outbox, preference controls |
| P7: operations, verification, and pilot freeze | 7–10 days | All preceding R1 increments | Reports/appeals, privacy requests, analytics, accessibility, restore exercise, operator training, release evidence |

### D0: demonstrate recommendation behavior

1. Generate fictional student personas, CWRU-scoped fictional labs, openings, and PI/recruiter records with stable IDs, an explicit `synthetic` marker, a fixed evaluation date, and documented scenario intent. Include beginners, distinct fields, strict paid-only preferences, schedule conflicts, missing fields, closed/expired listings, and unverified contacts. Do not fabricate mentorship ratings.
2. Produce repeatable ranked examples for both feeds. Show the supporting profile/lab evidence, missing information, hard-filter exclusion reasons, and permitted action. A numerical internal rule score is a debugging quantity, never a hiring probability or student-facing match percentage.
3. Verify reproducibility, references, status truth, strict unknown handling, identity invariance, no-resume discovery, feedback/reset, and different-interest ranking changes. Keep rule-derived expected outputs separate from independent relevance labels. Demo interaction does not send inquiries, applications, or messages.

### P0: resolve the build contract and supply workflow

1. Write `docs/technical-design.md` with chosen package versions, service responsibilities, environment separation, conceptual entity-to-policy design, failure behavior, retention decisions, and unresolved choices. Verify each R1 row of the traceability map has an owner and test location.
2. Convert the Impeccable brief into annotated responsive flows: beginner discovery, status-aware lab/opening detail, application preview/tracker, and recruiter review/reconfirmation. Prioritize actual student tasks over a marketing feed. Verify uncertainty labels and next actions with a beginner and a recruiting contact.
3. Assign operators and validate a low-effort recruiting workflow. Explore an authorized CampusGroups curator import and delegated recruiter management with participating PI permission; do not require every PI to recreate sourced facts. Verify canonical lab identity, recruiting contact, actual capacity, response expectations, and confirmation responsibility.

### P1: establish private data boundaries first

1. Scaffold the agreed TypeScript web application and local Supabase development environment. Define environment examples without credentials, ignore private/raw data and secrets, and isolate demonstration data from production configuration. Verify local build and a clean browser/server secret boundary.
2. Implement `src/server/auth/` and `src/server/policies/`: email/session handling, separate undergraduate verification, owner/delegate decisions per lab, recovery, sign-out, and privileged audit events. Verify unrelated domains, disputed roles, revoked sessions, guessed IDs, and unauthorized lab claims fail.
3. Design and test database and storage policies before real uploads. Verify Student A cannot read Student B's file/profile/application; Lab A cannot read Lab B's applicant; routine moderators cannot browse resumes; direct object access and export paths enforce the same boundary.

### P2: make recruiting information trustworthy

1. Implement lab curation, canonical identity, source dates, unclaimed/confirmed distinctions, authorized corrections, student tasks, training, and actual day-to-day supervisor. Verify an import cannot turn catalog presence into an opening or erase lab-confirmed status.
2. Implement publications with source identifiers, attribution state, venue/date, preprint distinction, explicit unavailable data, and period/coverage on counts. Undergraduate output needs evidence and permission. Verify ambiguous authors do not become confirmed output and no venue prestige enters ranking or mentorship claims.
3. Implement draft, publish, pause, close, reuse and reconfirm transitions. Validate required listing fields, separate requirements/preferences, and permitted external routes. Compute effective expiry as the earlier policy freshness deadline or closing deadline; recheck it on reads and on submission inside the transaction. The scheduler updates indexes/caches and sends reconfirmation reminders, but request-time checks remain authoritative if it fails.
4. Show confirmed openings, accepting inquiries, not recruiting and unknown explicitly. Verify a stale saved item stays visibly closed/expired, preserving application history, and an external action identifies its destination without claiming submission.

### P3: confirm student facts before using them

1. Implement editable manual interests, goals, coursework, skills, projects, experience, graduation, hours, schedule blocks, duration, location and compensation preferences. Onboarding can skip enrichment. Verify a first-year without a resume reaches useful discovery with no invented skills.
2. Implement private PDF/DOCX intake with the chosen size policy, content validation, unsafe-file handling, consent before third-party parsing, processing states, retry and manual recovery. The worker returns draft facts with source references; confirmation is a separate recorded student action. Verify unconfirmed extraction never enters recommendation or sharing inputs.
3. Implement replacement/deletion and propagation to derived facts, indexes, recommendation caches and authorized file downloads. Keep an immutable application event record while revoking the deleted file reference; use a download authorization layer so old links cannot bypass revocation. Resolve signed-URL behavior and backup deletion policy before intake of real files. Verify old application links cannot download a withdrawn/deleted resume.

### P4: deliver dependable discovery and recommendations

1. Build keyword/text search over lab names, PIs, topics, methods, departments, openings and sourced publication descriptions. Add ordinary-language token handling and evidence snippets before semantic retrieval. Verify exact-name lookup and core application handling still work when recommendation processing is unavailable.
2. Apply user-selected strict discovery filters consistently to search and both recommendation feeds, including exploratory labs and related people. Unknown information fails a strict constraint; explain the missing fact and offer an intentional way to broaden filters. Profile hours and schedule constrain opening actionability by default, rather than silently filtering lab exploration; label those controls "Availability for openings." Explicit paid-only and beginner discovery filters constrain both feeds. Exploratory labs with unknown practical fit must show what is unknown, never claim compatible hours or eligibility. Preserve distinct lab and opening types, private saves, comparison fields, stacked phone layout, loading, incomplete-data, no-match and service-failure states.
3. Implement the versioned matching pipeline in `src/domain/recommendations/`: candidate retrieval → authority/status checks → hard constraints → content ranking → faithful explanations → feedback filtering. Separate actionable openings from exploratory labs; people are verified PIs or authorized contacts tied to their permitted lab scope. Derive contact actions from authorization and inquiry/application state, never from ranking strength.
4. Support save, dismiss, already-contacted, preference editing and reset for both feeds. Store user-private feedback, recompute on confirmed profile/status changes, and invalidate affected cached candidates. Dismissals remain hidden until reset or a disclosed material-update rule. Verify a lab closure removes application actions without waiting for a cache TTL.
5. Run domain tests and independently labeled retrieval evaluation before freezing provisional weights. Do not add collaborative filtering, embeddings, or an LLM unless the baseline's observed failure justifies a separate proposal and evaluation.

### P5: preserve application integrity and response visibility

1. Build preview of the exact receiving lab, confirmed profile facts, chosen file, and short opportunity-specific response. The server transaction rechecks verification, listing openness/expiry, hard requirements and share permissions, then uses an idempotency key and uniqueness invariant to write one snapshot, event and durable receipt. Verify double clicks/retries and concurrent requests create one application.
2. Define allowed actors and transitions for submitted, under review, interview requested, offer made, accepted, declined, not selected and withdrawn. Record actual start separately with one-party versus both-party confirmation. Verify automatic acknowledgments cannot become substantive responses, offers or starts.
3. Build assigned-lab queues, shortlisting, private notes, delegation, decision messages, withdrawal and event history. Profile edits affect future applications; submitted facts stay understandable and file access can still be revoked. Verify closure preserves existing history and unauthorized lab members cannot view an applicant.
4. Make next steps and response expectations visible in the tracker and recruiter queue. Assign every unanswered application or permitted inquiry an accountable delegated recruiter and a backup recruiting operator. Define a proposed follow-up due-time policy before pilot enrollment; it sets an escalation expectation, never a guaranteed reply. Show student-visible waiting, follow-up requested and follow-up closed states alongside the application lifecycle without inventing a human review or decision. Use a bounded reminder sequence and then a bounded escalation to the operator; record the policy version and attempts, allow reminder opt-out, and close follow-up on a substantive response, withdrawal, explicit closure or exhausted escalation with an honest explanation. Opting out of reminders must not silently withdraw an application. Verify repeated jobs cannot create unbounded outreach and automated reminders never count as substantive responses. External link clicks remain handoffs; student-reported status and destination-confirmed events are distinct.

### P6: connect students with the authorized person

1. Create participant-scoped conversations tied to a lab, allowed inquiry or application. General inquiries require lab opt-in and an authorized responding contact; unclaimed contacts get an accurate alternative action. Verify guessed conversation IDs and unauthorized participants fail.
2. Add text messages, sender identity, report controls, blocking of new nonessential outreach and server initiation limits. Keep recruiter notes separate from messages. Verify role revocation, blocked outreach, report confidentiality and existing essential application notices follow the defined policy.
3. Use a transactional notification outbox with idempotent retry, delivery/error states and preferences for submissions, messages, interviews, decisions and reconfirmation. Email includes minimal context and a protected in-app link. Verify delivery failure cannot erase or duplicate the application/message event.

### P7: make the pilot operable and verify R1

1. Provide restricted reports, acknowledgments, corrections, conduct rules, moderation actions, appeals, scoped support reasons, audit logs, data export/deletion and official CWRU guidance links. Verify credit/compensation labels do not imply approval and routine staff roles cannot browse private content.
2. Instrument the event definitions below, error dashboards, report backlog, stale-apply attempts and job reconciliation. Exercise database restore, retry/dead-letter recovery and incident containment with synthetic data. Verify recovery before reopening any affected private-data capability.
3. Complete mobile, keyboard, zoom and assistive-technology checks against WCAG 2.2 AA; perform a rendered Impeccable review of shipped screens after implementation. Fix blocking/major issues and retain evidence, including tested viewport/state, before release. A plan review is not an accessibility or visual implementation pass.
4. Freeze R1 feature scope, train operators, collect real permissioned inventory and response commitments, register the pilot cohort/windows, and execute every R1 acceptance check in `docs/requirements-map.csv`. Launch only with results, owners and residual issues documented; do not rename a partial slice R1 complete.

## 5. Recommendation design and evaluation

### Behavior contract

- **Inputs:** confirmed profile facts, declared interests/goals, availability and explicit hard preferences, followed topics, private saved-item signals and explicit feedback. Raw resume text, unconfirmed facts, names/photos/contact details, GPA, private conversations, sensitive traits, review identity, payments and popularity never enter scoring.
- **Constraints first:** active/current opening, CWRU scope, student eligibility, truly required skills versus trainable skills, and applicable practical requirements precede ranking. Profile hours and schedule apply to opening actionability by default; discovery of a lab or person does not itself establish practical fit. Explicit strict discovery filters, including paid-only or beginner requirements, constrain both feeds and exploratory collections; unknown facts fail those filters. Show unknown hours, schedule or eligibility on exploratory labs as unresolved, not compatible. Never silently relax a selected filter.
- **Ranking:** transparent topic/method relevance, confirmed transferable skills and explicit learnable/beginner pathways. Keep declared learning goals capable of supporting exploration beyond past experience. Weights and tie-break behavior are versioned; stable IDs provide deterministic ties, not an implicit quality boost.
- **Two feeds:** one discovery surface separates opening suggestions from lab exploration; the other suggests verified relevant PIs/authorized recruiters with role, lab, reason and allowed contact action. No peers in R1. A relevant closed lab is exploration only, and no unclaimed account is messaging-enabled.
- **Explanations:** state evidence, missing information and requirements to check in plain language. Never display a match percentage, hiring probability, publication promise or guaranteed reply. A weak/no-overlap result is exploratory, not a strong match.
- **Feedback and freshness:** save/dismiss/contacted and profile edits change user-private state; reset is explicit. Recheck source status before exposing an application action and again at submission. Record ranking version and reason codes without raw private source text in analytics.

### Separate three kinds of evidence

| Evidence | Useful for | Cannot establish |
|---|---|---|
| Synthetic fixtures and invariant checks | Reproducibility, filtering, explanation consistency, cold start, status/action truth, feedback and identity invariance | Real relevance, fairness across actual students, better placement or response behavior |
| Independently labeled offline examples | Relevance and hard-constraint errors against a simple topic-only baseline | Actual starts, causal improvement, ongoing lab participation |
| Prospective pilot observation | Exposure-to-action usefulness, response funnel, confirmed starts and repeat recruiting | Causal benefit without an appropriate comparison and disclosed selection/observation limits |

For offline evaluation, obtain representative consented or independently constructed student-lab examples labeled by reviewers who did not author the ranking rules. Include department diversity, beginners, transfers of skills, missing facts, no-match queries and practical conflicts. Hold out examples before tuning weights; freeze versions and dataset splits. Record label disagreement rather than forcing false certainty.

Use precision@5 and nDCG@5 for labeled relevance, eligibility-error rate, stale-action rate, recommendation coverage, no-result rate and explanation-evidence consistency. Compare both feeds with a topic-only baseline under the **same** hard filters. Inspect experience-level and department slices with counts; sparse data is inconclusive. Require zero known eligibility or stale-action violations in release fixtures; decide real-data relevance thresholds after labels exist rather than inventing a success number now.

## 6. Measurement and pilot decisions

Event schema proposal: `event_id`, UTC timestamp, event type, permitted pseudonymous actor, entity type/ID, cohort, session/exposure ID, source route, ranking version where applicable, and outcome provenance. Keep resume bodies, message bodies, sensitive query text and unnecessary identifying fields out of general analytics. Separate operational audit access from product analytics.

| Metric | Numerator / denominator and window |
|---|---|
| Activation | Verified signups with save, permitted inquiry or portal application within seven days / verified signups eligible for that full window |
| Discovery usefulness | Sessions with explicit useful mark, save, inquiry or application / discovery sessions; show each action separately |
| Suggestion usefulness | Useful/save/inquiry/application actions linked to a recorded suggestion exposure / suggestion exposures, with unique-user/session views alongside repeated exposures |
| Recommendation failures | Dismissals, ineligible-result reports, no-results and stale actions / relevant exposures or requests; preserve reason counts |
| Current opening coverage | Visible active openings with current confirmation / visible active openings; empty inventory is reported as no inventory, not 100% coverage |
| Substantive response | Portal applications with a human review response, decision or interview request in 14 days / applications old enough for that window; exclude automatic receipts and report inquiries separately |
| Interview and offer conversion | Each stage / submitted portal applications in a frozen cohort; disclose observation lag and missing follow-up |
| Actual starts | Distinct students with a start confirmed by both student and lab; one-party reports shown separately; acceptance is not a start |
| Repeat recruiting | Labs reconfirming or opening another cycle / labs completing a prior cycle with sufficient follow-up; distinguish intent from observed return |

Treat the PRD's proposed six-week pilot of 10 labs, five openings and approximately 50 students as a hypothesis to confirm with actual supply. Likewise 70% substantive response, five actual starts and half of labs intending to return are proposed continuation hypotheses, not results or automatic pass criteria. Freeze cohort membership, observation windows, eligible denominators and confirmation rules before enrollment. Never remove unsuccessful/ineligible submissions retrospectively to improve the rate. Record continue/revise/stop reasoning, failures and incomplete follow-up.

## 7. Verification and release evidence

| Level | Required checks | Suggested evidence location |
|---|---|---|
| Domain | Status/expiry boundaries; required/preferred skills; strict unknown fields; deterministic rank/ties; cold start; excluded identity inputs; feedback/reset; allowed application transitions | `tests/unit/` plus machine-readable scenario results |
| Integration | Student/lab/role access matrix; direct file download and deletion; profile confirmation; immutable snapshot; submission concurrency/idempotency; closed-form race; participant checks; outbox retry | `tests/integration/` with local synthetic database fixtures |
| Student E2E | Skip resume → search → compare → both feeds → inspect evidence → preview/apply → receipt → profile edit → original snapshot → interview/withdrawal | `tests/e2e/student-journey.spec.ts` with phone and desktop traces |
| Recruiter E2E | Verify delegation → edit/reconfirm opening → review own queue/notes → respond → close → preserve applicant history | `tests/e2e/recruiter-journey.spec.ts` |
| Failure E2E | Corrupt file, failed parser, recommendation failure with search fallback, no matches, expired/paused opening, revoked delegate, failed email, external handoff, bounded unanswered follow-up with reminder opt-out/closure | `tests/e2e/recovery.spec.ts` |
| Accessibility and UX | Keyboard order/focus, labels/errors/status announcements, contrast, 200% zoom/reflow, phone touch targets and stacked comparison, assistive technology, rendered Impeccable review | `docs/release-evidence/` with viewport/state and remaining findings |
| Operations | Real inventory/permissions, named owners, moderation/appeals, privacy request completion, restore and incident exercise, metric definitions and cohort freeze | `docs/release-evidence/` operator sign-off and dated results |

R1 is ready only when all 45 R1 acceptance checks pass, private-data boundaries and freshness races are verified, both feeds and non-AI fallback work, live recruiting coverage is credible, and operators can run the pilot. No open blocking access, privacy, submission-integrity or misleading-status issue may be waived by a visually polished demo.

## 8. R2 gates and later work

**R2A: mentorship feedback (REV-1–4).** Independently verify actual experience without PI veto; isolate identity/evidence from displayed feedback; restrict reading to verified undergraduate eligibility; provide structured supervisory context, moderation, correction and appeals. The proposed five-independent-contributor floor never overrides a small-lab re-identification assessment. No fabricated ratings or automatic journal-to-mentorship score. Verify faculty/recruiter exclusion and unsafe/sparse suppression before display.

**R2B: student connections (PEER-1–2).** Define current/former student eligibility and any alumni access, then introduce default-off minimal profiles, requests, visibility controls, consent withdrawal and blocking. This can support graduating-student introductions only with permission. Never reveal private applications, resumes, membership or review authorship through a profile or recommendation. Release independently of R2A when its own operational and authorization gates pass.

Later semantic retrieval, collaborative models, calendar integrations and expansion require evidence-based proposals. A new model must beat the frozen simple baseline on independently labeled examples without weakening hard constraints, explanation faithfulness, privacy or beginner access.

## 9. Immediate next build ticket

After reviewing this plan and the Impeccable brief, create P0's technical decision record and P1's local scaffold. First prove separate undergraduate/lab authority and private-file access with synthetic fixtures. Then build the catalog/opening slice so the first real discovery view has explicit recruiting truth before any real resumes or applications are collected.
