# Impeccable planning review

Date: October 27, 2026  
Method: independent architecture and UX planning review using Impeccable's Shape and Operate guidance.  
Scope: `docs/implementation-plan.md`, `docs/requirements-map.csv`, and the live-PRD snapshot `docs/source-prd.txt`. No rendered screen, production code, live permission boundary, or accessibility conformance was assessed.

## Decision

No blocking plan-level gap found. Both minor findings were resolved in the revised plan, leaving no open findings within this planning review. The plan is ready to guide the technical-design phase. Operational thresholds still require the planned policy decisions before pilot enrollment. This review does not approve a rendered interface or declare R1 complete.

## Requirements coverage

An independent CSV and source-ID check found **51 source requirements, 51 unique mapped rows, no missing or extra IDs, and no empty cells**: 45 R1 requirements and six staged R2 requirements. Each row supplies an implementation responsibility and verification intent.

## Review findings

| Area | Planning finding |
|---|---|
| Primary task and audience | Student discovery and recruiter follow-through lead; the plan supports beginners without resumes and delegated recruiting rather than requiring repeated PI administration. |
| Recruiting truth | Current openings, broader lab exploration, inquiry-only status, and unknown status remain distinct. Request-time and transaction-time freshness checks supplement the scheduler. |
| Recommendation clarity | Both required feeds are included. Confirmed facts, explicit constraints, evidence-backed reasons, missing information, feedback/reset, and stable ranking versions are specified. No selection probability or prestige/popularity ranking is proposed. |
| Contact authority | Relevant people need verified affiliation, claimed accounts, and lab-specific authority. Contact action derives from permission and recruiting state rather than relevance strength. |
| Private information | Manual entry, consent, draft extraction confirmation, private storage, scoped downloads, deletion propagation, immutable factual snapshots, and revocable file access are addressed. |
| Failure and recovery | Loading, incomplete information, no matches, expired/paused roles, revoked authority, parsing failures, external handoffs, notification failures, and dependable text-search fallback have verification paths. |
| Responsive and accessible operation | Phone layouts, stacked comparisons, keyboard/focus, labels, status announcements, zoom/reflow, touch targets, and assistive-technology checks are required. Actual conformance remains an implementation gate. |
| Demo and evidence boundaries | Synthetic mechanics, independent offline relevance labels, and prospective pilot outcomes are separated. The local demonstration does not count as production authorization or placement evidence. |
| Staged scope | Reviews and student connections remain independently gated R2 capabilities. The graduating-student handoff annotation does not silently expand R1. |

## Findings and verified resolutions

1. **P2 — Unanswered-outreach workflow: resolved in planning.** Revised P5 assigns an accountable delegated recruiter and backup operator, requires a versioned proposed due-time policy, and specifies bounded reminders/escalation plus waiting, follow-up requested, and follow-up closed states. Reminder opt-out does not withdraw an application; substantive response, withdrawal, explicit closure, or exhausted escalation closes follow-up. The verification plan now checks bounded jobs and excludes automated reminders from human-response counts. Exact timing remains an explicit operating-policy decision rather than a reply guarantee.
2. **P2 — Filter scope: resolved in planning.** Revised P4 and the recommendation behavior contract label profile time controls "Availability for openings" and distinguish opening actionability from broader research exploration. Explicit strict discovery filters constrain both feeds, with unknown evidence failing. Exploratory lab records must disclose unknown practical fit instead of claiming compatible hours or eligibility. The SEARCH-2 and REC-3 traceability rows preserve this distinction for implementation verification.

## Implementation review gate

The local demo and later production screens still need a rendered review at desktop and phone widths using real fixture content, including the no-match and inquiry-only states. Check that a first-time student can identify the next action, understand why a suggestion appears, and distinguish an exploratory lab from an available role. Evaluate the selected visual direction only after it is chosen and rendered; no heuristic score is invented for this planning-only pass.
