import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFile(resolve(root, path), 'utf8');

function parseCsv(text) {
  const rows = []; let row = []; let field = ''; let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const value = text[index];
    if (value === '"' && quoted && text[index + 1] === '"') { field += '"'; index += 1; }
    else if (value === '"') quoted = !quoted;
    else if (value === ',' && !quoted) { row.push(field); field = ''; }
    else if (value === '\n' && !quoted) { rows.push([...row, field]); row = []; field = ''; }
    else if (value !== '\r') field += value;
  }
  if (field || row.length) rows.push([...row, field]);
  assert.equal(quoted, false, 'CSV has an unterminated quoted field');
  return rows;
}

const source = await read('docs/source-prd.txt');
const metadata = JSON.parse(await read('docs/source-prd.metadata.json'));
const sourceIds = [...new Set(source.match(/\b(?:AUTH|PROF|LAB|OPEN|SEARCH|REC|APP|MSG|SUP|MOD|REV|PEER)-\d+\b/g))].sort();
const [header, ...rows] = parseCsv(await read('docs/requirements-map.csv'));
const idIndex = header.indexOf('requirement_id');
assert.ok(idIndex >= 0, 'Missing requirement_id column');
assert.ok(rows.every(row => row.length === header.length && row.every(Boolean)), 'CSV fields must be populated');
assert.equal(new Set(rows.map(row => row[idIndex])).size, rows.length, 'Duplicate requirement IDs');
assert.deepEqual(rows.map(row => row[idIndex]).sort(), sourceIds, 'PRD coverage mismatch');
assert.equal(sourceIds.length, 51);
const hash = createHash('sha256').update(source).digest('hex');
assert.equal(hash, metadata.snapshotSha256, 'PRD snapshot differs from recorded source');
const report = { checkedDate: '2026-10-27', requirementCount: rows.length,
  sourceHashMatches: true, missingRequirements: [], duplicatedRequirements: [],
  note: 'Traceability and source-integrity verification; no product acceptance tests were executed.' };
await writeFile(resolve(root, 'docs/plan-verification.json'), JSON.stringify(report, null, 2) + '\n');
process.stdout.write(`Verified ${rows.length} unique PRD requirements and source snapshot integrity.\n`);
