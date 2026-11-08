import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { recommend } from '../demo/recommender.mjs';
import { filterLabResults } from '../demo/lab-search.mjs';

const dataset = JSON.parse(readFileSync(new URL('../data/simulation/dataset.json', import.meta.url)));
const result = recommend(dataset, dataset.students[0], { limit: 1000 });
const base = { query: '', school: '', department: '', topic: '', status: '', savedOnly: false };
const search = (filters, saved = []) => filterLabResults(result, dataset, { ...base, ...filters }, saved).labs;
const genome = dataset.labs.find(lab => lab.id === 'lab-01');

assert.equal(search({ query: '  GENOME SIGNALS  ' })[0].id, 'lab-01');
assert.equal(search({ query: 'no-such-research-area' }).length, 0);
assert.ok(search({ school: genome.school }).every(item => dataset.labs.find(lab => lab.id === item.labId).school === genome.school));
assert.equal(search({ department: genome.department, topic: 'genetics' })[0].id, 'lab-01');
assert.equal(search({ department: genome.department, topic: 'robotics' }).length, 0);
assert.ok(search({ status: 'accepting_inquiries' }).every(item => item.status === 'accepting_inquiries'));
assert.equal(search({ savedOnly: true }).length, 0);
assert.deepEqual(search({ savedOnly: true }, ['lab:lab-01']).map(item => item.id), ['lab-01']);
assert.equal(search({}).length, result.labs.length);
assert.equal(filterLabResults(result, dataset, null), result);
console.log('PASS: 10 lab-search assertions');
