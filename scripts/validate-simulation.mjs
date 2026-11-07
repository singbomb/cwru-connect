import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { recommend, RANKING_VERSION } from '../demo/recommender.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'data/simulation');
const dataset = JSON.parse(readFileSync(resolve(output, 'dataset.json'), 'utf8'));
const checks = [];
const check = (name, callback) => { callback(); checks.push({ name, passed: true }); };
const student = id => dataset.students.find(item => item.id === id);
const all = (profile, options = {}) => recommend(dataset, profile, { limit: 100, ...options });
const openingIds = result => result.opportunities.map(item => item.id);
const ids = result => ['opportunities', 'labs', 'people'].map(type => result[type].map(item => item.id));

function checkIntegrity() {
  for (const type of ['students', 'labs', 'openings', 'people', 'scenarios']) {
    check(`${type}: unique stable IDs`, () => assert.equal(new Set(dataset[type].map(item => item.id)).size, dataset[type].length));
    check(`${type}: every record marked synthetic`, () => assert.ok(dataset[type].every(item => item.synthetic === true)));
    check(`${type}: CSV export exists`, () => assert.ok(readFileSync(resolve(output, `${type}.csv`), 'utf8').startsWith('"id"')));
  }
  check('Dataset sizes match demo design', () => assert.deepEqual([dataset.students.length, dataset.labs.length, dataset.openings.length, dataset.people.length], [8, 24, 18, 30]));
  check('Foreign keys resolve', () => assert.ok([...dataset.openings, ...dataset.people].every(item => dataset.labs.some(lab => lab.id === item.labId))));
  check('Contacts use reserved invalid domain', () => assert.ok(dataset.people.every(person => person.email.endsWith('@example.invalid'))));
  check('Snapshot date and ranking version are frozen', () => assert.deepEqual([dataset.metadata.asOf, dataset.metadata.rankingVersion], ['2026-10-27', RANKING_VERSION]));
}

function checkDiscovery() {
  const computational = all(student('student-01'));
  const robotics = all(student('student-03'));
  const beginner = all(student('student-02'), { beginnerOnly: true });
  check('Computational persona leads with genomics opening', () => assert.equal(computational.opportunities[0].id, 'opening-01'));
  check('Robotics persona leads with robotics opening', () => assert.equal(robotics.opportunities[0].id, 'opening-03'));
  check('Interests change research exploration order', () => assert.notDeepEqual(computational.labs.map(item => item.id), all(student('student-01'), { topics: ['robotics', 'engineering'] }).labs.map(item => item.id)));
  check('No-resume beginner receives relevant training', () => assert.equal(beginner.opportunities[0].id, 'opening-02'));
  check('Beginner-only results have explicit beginner eligibility', () => assert.ok(beginner.opportunities.every(item => dataset.openings.find(opening => opening.id === item.id).beginnerFriendly)));
  check('No-profile suggestions disclose exploration', () => assert.ok(all(student('student-08')).opportunities.every(item => item.reasons.some(reason => reason.startsWith('Exploratory')))));
  check('Tight paid schedule produces honest no-opening state', () => assert.equal(all(student('student-07')).opportunities.length, 0));
  check('Relevant closed lab remains exploration only', () => assert.equal(computational.labs.find(item => item.id === 'lab-12').action.kind, 'explore_lab'));
  check('Every suggestion has reasons, caveats, and safe action', () => assert.ok([...computational.opportunities, ...computational.labs, ...computational.people].every(item => item.reasons.length && Array.isArray(item.caveats) && item.action.label && item.synthetic)));
}

function checkEligibility() {
  const computational = all(student('student-01'));
  check('Schedule conflict wins over topical relevance', () => assert.ok(!openingIds(computational).includes('opening-18') && computational.excluded.find(item => item.id === 'opening-18').reasons.some(reason => reason.includes('schedule'))));
  check('Expired, paused, closed, and draft openings never actionable', () => assert.ok(['opening-11', 'opening-12', 'opening-15', 'opening-16'].every(id => !openingIds(computational).includes(id))));
  check('Required skills cannot be inferred from interests', () => assert.ok(!openingIds(all(student('student-02'))).includes('opening-01')));
  check('Insufficient academic year and experience excluded', () => assert.ok(all(student('student-02')).excluded.find(item => item.id === 'opening-01').reasons.includes('Academic year does not meet confirmed eligibility')));
  check('Unknown required facts excluded', () => assert.ok(computational.excluded.find(item => item.id === 'opening-17').reasons.some(reason => reason.includes('unknown'))));
  const paid = all(student('student-01'), { paidOnly: true });
  check('Paid-only excludes unpaid and unknown compensation', () => assert.ok(paid.opportunities.every(item => item.compensation === 'paid')));
  check('Paid-only exploration supported by eligible paid opening', () => assert.ok(paid.labs.every(lab => paid.opportunities.some(opening => opening.labId === lab.id))));
  check('Unknown schedule fails availability constraint', () => assert.ok(!openingIds(computational).includes('opening-14')));
  check('An expired deadline is rejected at exact boundary', () => assert.ok(!openingIds(all(student('student-01'), { asOf: '2026-11-15' })).includes('opening-01')));
  const expiryFixture = structuredClone(dataset);
  expiryFixture.openings[0].closesAt = null;
  check('Thirty-day confirmation expires at exact boundary', () => assert.ok(!openingIds(recommend(expiryFixture, student('student-01'), { asOf: '2026-11-19', limit: 100 })).includes('opening-01')));
}

function checkPrivateInputs() {
  const base = student('student-01');
  const changed = { ...structuredClone(base), name: 'Different Name', email: 'other@example.invalid', photo: 'different', gpa: 4.0, privateMessages: ['Any private text'], inferredSensitiveTrait: 'unused' };
  check('Identity, GPA, private messages, and sensitive traits do not affect order', () => assert.deepEqual(ids(all(base)), ids(all(changed))));
  check('Identity fields do not affect score or explanations', () => assert.deepEqual(all(base), all(changed)));
  const draft = structuredClone(student('student-02'));
  draft.resumeFacts = [{ kind: 'skill', value: 'CAD', confirmed: false, source: 'draft' }];
  check('Unconfirmed extracted skill cannot influence result', () => assert.deepEqual(all(student('student-02')), all(draft)));
  const confirmed = structuredClone(student('student-02'));
  confirmed.resumeFacts[0].confirmed = true;
  check('Confirmed extracted skill can support explanation', () => assert.ok(all(confirmed).labs.some(item => item.reasons.some(reason => reason.includes('Python')))));
  const result = all(base);
  check('Every suggested person has verified authority and claimed account', () => assert.ok(result.people.every(item => {
    const person = dataset.people.find(person => person.id === item.id);
    return person.affiliationVerified && person.authorized && person.accountClaimed;
  })));
  check('Unverified and unauthorized people omitted', () => assert.ok(['person-23', 'person-24', 'person-28', 'person-29', 'person-30'].every(id => !result.people.some(person => person.id === id))));
  check('Inquiry previews require lab and person consent', () => assert.ok(result.people.filter(item => item.action.kind === 'preview_inquiry').every(item => {
    const person = dataset.people.find(person => person.id === item.id);
    return person.acceptsInquiries && dataset.labs.find(lab => lab.id === item.labId).acceptsInquiries;
  })));
}

function checkControls() {
  const base = student('student-01');
  const result = all(base);
  for (const [feed, type] of [['opportunities', 'opening'], ['labs', 'lab'], ['people', 'person']]) {
    const id = result[feed][0].id;
    check(`${feed}: dismiss hides item`, () => assert.ok(!all(base, { feedback: { dismissed: [`${type}:${id}`], contacted: [] } })[feed].some(item => item.id === id)));
    check(`${feed}: already contacted hides item`, () => assert.ok(!all(base, { feedback: { dismissed: [], contacted: [`${type}:${id}`] } })[feed].some(item => item.id === id)));
    check(`${feed}: reset restores original results`, () => assert.deepEqual(result[feed], all(base, { feedback: { dismissed: [], contacted: [] } })[feed]));
  }
  check('Saved item is an explicit bounded ranking input', () => assert.ok(all(base, { saved: ['lab:lab-24'] }).labs.find(item => item.id === 'lab-24').reasons.includes('You saved this item')));
  check('Saved item cannot bypass required opening constraints', () => assert.ok(!openingIds(all(base, { saved: ['opening:opening-18'] })).includes('opening-18')));
  check('Recompute after closure prevents stale opening recommendation', () => {
    const closed = structuredClone(dataset);
    closed.openings[0].status = 'closed';
    assert.ok(!openingIds(recommend(closed, base, { limit: 100 })).includes('opening-01'));
  });
  check('Expired lab claim cannot remain a confirmed vacancy', () => {
    const expired = all(base, { asOf: '2026-11-20' });
    assert.ok(expired.labs.every(lab => lab.status !== 'confirmed_opening'));
    assert.ok(expired.people.every(person => person.status !== 'confirmed_opening'));
  });
  check('Active constraint mismatch differs from inventory expiry', () => {
    const lab = all(base).labs.find(lab => lab.id === 'lab-03');
    assert.equal(lab.status, 'confirmed_opening');
    assert.ok(lab.caveats.includes('Current openings do not meet your confirmed constraints'));
    assert.ok(all(base, { asOf: '2026-11-20' }).labs.find(lab => lab.id === 'lab-03').caveats.includes('No current confirmed opening is available in this snapshot'));
  });
  check('Fixed inputs give deterministic outputs', () => assert.deepEqual(recommend(dataset, base), recommend(dataset, base)));
}

function checkInvalidInputs() {
  const base = student('student-01');
  for (const asOf of ['invalid', '', '2026-02-30', '2026-13-01', '2026-1-01', null, 123]) {
    check(`Invalid calendar date rejected: ${String(asOf)}`, () => assert.throws(() => all(base, { asOf }), /valid calendar date/));
  }
  for (const [name, values] of Object.entries({
    maxWeeklyHours: [NaN, Infinity, -1, 169, '10', null],
    minimumCommitmentMonths: [NaN, Infinity, -1, 121, '6', null],
    limit: [NaN, Infinity, -1, 0, 1.5, 1001, '6', null],
  })) {
    for (const value of values) check(`Invalid ${name} rejected: ${String(value)}`, () => assert.throws(() => all(base, { [name]: value }), RangeError));
  }
  for (const options of [{ topics: 'genetics' }, { topics: [3] }, { topics: null }, { scheduleBlocks: ['invalid'] }, { scheduleBlocks: null }, { feedback: [] }, { feedback: null }, { weights: null }, { feedback: { dismissed: [null] } }, { feedback: { dismissed: null } }, { saved: 'lab:lab-01' }, { paidOnly: 'false' }, { beginnerOnly: null }]) {
    check(`Malformed option rejected: ${JSON.stringify(options)}`, () => assert.throws(() => all(base, options), TypeError));
  }
  for (const weights of [{ topics: NaN }, { skills: Infinity }, { learning: -1 }, { saved: '1' }, { unknown: 1 }]) {
    check(`Invalid weight rejected: ${Object.keys(weights)[0]}`, () => assert.throws(() => all(base, { weights }), RangeError));
  }
  check('Valid leap-day date remains usable', () => assert.equal(all(base, { asOf: '2028-02-29' }).asOf, '2028-02-29'));
  check('Duplicate topic values cannot inflate relevance', () => assert.deepEqual(all(base, { topics: ['genetics'] }), all(base, { topics: ['genetics', 'genetics'] })));
  check('Malformed opening deadline fails closed', () => {
    const malformed = structuredClone(dataset);
    malformed.openings[0].closesAt = '2026-02-30';
    assert.ok(!openingIds(recommend(malformed, base, { limit: 100 })).includes('opening-01'));
  });
}

function checkCrossFeedAndRequirements() {
  const base = student('student-01');
  const before = all(base, { paidOnly: true });
  const hidden = all(base, { paidOnly: true, feedback: { dismissed: ['opening:opening-01'], contacted: [] } });
  check('Opening dismissal does not hide related lab or people under strict filters', () => {
    assert.deepEqual(before.labs, hidden.labs);
    assert.deepEqual(before.people, hidden.people);
    assert.ok(!openingIds(hidden).includes('opening-01'));
  });
  check('Lab dismissal does not hide related people or openings', () => {
    const result = all(base, { feedback: { dismissed: ['lab:lab-01'], contacted: [] } });
    assert.deepEqual(result.people, all(base).people);
    assert.deepEqual(result.opportunities, all(base).opportunities);
  });
  for (const [field, values] of Object.entries({
    minWeeklyHours: [NaN, Infinity, -1, 169, 'eight'],
    commitmentMonths: [NaN, Infinity, -1, 121, 'six'],
    requiredExperienceMonths: [NaN, Infinity, -1, 1201, 'three'],
    allowedYears: ['2', [2, '3']], requiredSkills: ['Python', [3]], requiredBlocks: ['mon_pm', [3]],
  })) {
    for (const value of values) check(`Malformed opening ${field} fails closed: ${String(value)}`, () => {
      const malformed = structuredClone(dataset);
      malformed.openings[0][field] = value;
      assert.ok(!openingIds(recommend(malformed, base, { limit: 100 })).includes('opening-01'));
    });
  }
}

checkIntegrity();
checkDiscovery();
checkEligibility();
checkPrivateInputs();
checkControls();
checkInvalidInputs();
checkCrossFeedAndRequirements();
const report = {
  synthetic: true, asOf: dataset.metadata.asOf, rankingVersion: RANKING_VERSION,
  passed: checks.length, failed: 0, checks,
  limitations: ['Synthetic invariants only; no real recommendation quality, adoption, fairness, security, or placement outcome has been established.', 'This validator does not test browser rendering or production authentication.'],
};
writeFileSync(resolve(output, 'validation-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`PASS: ${checks.length} simulation checks. Saved data/simulation/validation-report.json.`);
