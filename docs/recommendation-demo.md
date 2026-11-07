# Recommendation demonstration

Status: local synthetic demonstration, separate from the proposed production application. The simulation date is fixed at October 27, 2026 so expiry scenarios reproduce consistently.

## What to demonstrate

1. Pick a student persona. Read their interests, confirmed skills, time available, and resume state.
2. Inspect the suggested current openings. Each result should explain the evidence, practical fit, outstanding checks, and a safe demo action.
3. Compare exploratory labs with current openings. Unknown recruiting status and inquiry-only labs must remain explicit.
4. Switch to people. Show only simulation-verified PIs or authorized recruiters; contact controls must reflect lab permission.
5. Change interests, hours, paid-only, or beginner-only preferences. Show how the candidate set and order change. A strict filter with missing evidence fails rather than silently relaxing the constraint.
6. Save, dismiss, or mark an item already contacted. Reset restores suggestions. These are local demo preferences, not sent messages or applications.
7. Select the no-resume beginner and the constrained no-match scenario. Explain the manual-profile path and intentional recovery actions.

## How ranking works

The reusable `demo/recommender.mjs` module accepts the dataset, a synthetic student, and explicit options. It returns separate `opportunities`, `labs`, and `people` arrays, plus opening exclusions with reasons, the ranking version, and the simulation date. A pure function lets the eventual server reuse the same rules after trusted data retrieval; the local client itself is not an authorization boundary.

The rules apply opening freshness, scope/ownership, eligibility, schedule, weekly hours, commitment duration, and explicit strict filters before soft scoring. Confirmed declared skills and confirmed resume facts count; draft extraction does not. Topic overlap, transferable skills, learning goals, and saves contribute transparent configurable weights. Ties use stable IDs. Scores are internal ordering values and are not selection probabilities.

Exploration can show research-relevant labs without an eligible opening. Filters explicitly selected as strict still constrain the exploration results where evidence is required. People inherit relevant lab evidence and require simulated affiliation, authority, and claimed-account flags. Their permitted action may be an inquiry preview, opening view, or research-only exploration.

## What this proves

The generated fixtures and validator can demonstrate deterministic mechanics, hard-constraint handling, honest states, explanation consistency, privacy-input invariance, and reproducible ranking changes. They cannot establish useful recommendations for real students, authorization security of the future app, actual openings, recruiter response, or placement outcomes.

Before pilot launch, obtain independently labeled CWRU examples, compare with a topic-only baseline, examine beginner and department coverage, review explanations with students/recruiters, and report exposure and outcome denominators. Synthetic expectations created alongside the rules are regression checks rather than independent relevance ground truth.

## Presentation boundaries

Every record is fictional, even where school labels describe the proposed CWRU scope. No real resumes are uploaded, no accounts are verified, no applications are submitted, and no messages are sent. Preview actions state this at the point of use. Profile facts are supplied fixtures, not results from a live resume parser. Actual starts, response rates, and ratings are not fabricated.
