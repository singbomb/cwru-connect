import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { recommend, DEFAULT_WEIGHTS, RANKING_VERSION } from '../demo/recommender.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'data/simulation');
const synthetic = true;
const asOf = '2026-10-27';
const schools = ['School of Medicine', 'Case School of Engineering', 'College of Arts and Sciences', 'Frances Payne Bolton School of Nursing', 'Weatherhead School of Management', 'Jack, Joseph and Morton Mandel School of Applied Social Sciences'];
const blocks = ['mon_am', 'mon_pm', 'tue_am', 'tue_pm', 'wed_am', 'wed_pm', 'thu_am', 'thu_pm', 'fri_am', 'fri_pm'];

const labSeeds = [
  ['Genome Signals Lab', 0, 'Genetics and Genome Sciences', ['genetics', 'computational biology'], ['Python', 'R'], ['data analysis', 'genomics']],
  ['Neural Learning Lab', 2, 'Psychological Sciences', ['neuroscience', 'psychology'], ['statistics', 'Python'], ['behavioral methods', 'data analysis']],
  ['Soft Systems Robotics Lab', 1, 'Mechanical and Aerospace Engineering', ['robotics', 'engineering'], ['CAD', 'Python'], ['prototyping', 'robotics']],
  ['Community Care Lab', 3, 'Nursing', ['public health', 'health equity'], ['interviewing', 'statistics'], ['qualitative coding', 'community research']],
  ['Molecular Pathways Lab', 0, 'Biochemistry', ['cancer biology', 'cell biology'], ['pipetting', 'microscopy'], ['cell culture', 'imaging']],
  ['Climate and Watersheds Lab', 2, 'Earth, Environmental, and Planetary Sciences', ['environment', 'ecology'], ['GIS', 'R'], ['field sampling', 'data analysis']],
  ['Human Centered Devices Lab', 1, 'Biomedical Engineering', ['medical devices', 'engineering'], ['CAD', 'prototyping'], ['device testing', 'research design']],
  ['Language and Archives Lab', 2, 'History', ['history', 'digital humanities'], ['writing', 'archival research'], ['text analysis', 'archival research']],
  ['Decision and Organizations Lab', 4, 'Organizational Behavior', ['organizations', 'psychology'], ['statistics', 'survey design'], ['research design', 'data analysis']],
  ['Youth and Neighborhoods Lab', 5, 'Social Work', ['social policy', 'health equity'], ['interviewing', 'writing'], ['qualitative coding', 'community research']],
  ['Protein Design Lab', 0, 'Pharmacology', ['computational biology', 'drug discovery'], ['Python', 'chemistry'], ['molecular modeling', 'data analysis']],
  ['Brain Imaging Methods Lab', 0, 'Neurosciences', ['neuroscience', 'medical imaging'], ['Python', 'statistics'], ['imaging', 'data analysis']],
  ['Accessible Computing Lab', 1, 'Computer and Data Sciences', ['accessibility', 'human computer interaction'], ['JavaScript', 'research design'], ['usability testing', 'prototyping']],
  ['Sustainable Polymers Lab', 1, 'Macromolecular Science and Engineering', ['materials', 'environment'], ['chemistry', 'pipetting'], ['polymer synthesis', 'device testing']],
  ['Cellular Dynamics Lab', 0, 'Cell Biology', ['cell biology', 'genetics'], ['microscopy', 'pipetting'], ['imaging', 'cell culture']],
  ['Numbers and Networks Lab', 2, 'Mathematics, Applied Mathematics, and Statistics', ['mathematics', 'networks'], ['Python', 'statistics'], ['graph analysis', 'modeling']],
  ['Sleep and Daily Life Lab', 3, 'Nursing', ['public health', 'neuroscience'], ['interviewing', 'statistics'], ['research design', 'data analysis']],
  ['Music and Memory Lab', 2, 'Music', ['music', 'psychology'], ['writing', 'audio editing'], ['behavioral methods', 'text analysis']],
  ['Metabolic Networks Lab', 0, 'Systems Biology', ['computational biology', 'genetics'], ['Python', 'R'], ['genomics', 'modeling']],
  ['Urban Air and Health Lab', 1, 'Civil and Environmental Engineering', ['environment', 'public health'], ['GIS', 'Python'], ['field sampling', 'data analysis']],
  ['Materials for Repair Lab', 1, 'Materials Science and Engineering', ['materials', 'medical devices'], ['CAD', 'chemistry'], ['device testing', 'prototyping']],
  ['Migration Stories Lab', 2, 'Sociology', ['social policy', 'history'], ['interviewing', 'writing'], ['qualitative coding', 'archival research']],
  ['Immune Systems Lab', 0, 'Pathology', ['immunology', 'cancer biology'], ['pipetting', 'statistics'], ['cell culture', 'imaging']],
  ['Learning Technologies Lab', 2, 'Cognitive Science', ['education', 'human computer interaction'], ['JavaScript', 'writing'], ['usability testing', 'research design']],
];

function buildLabs() {
  return labSeeds.map(([name, school, department, topics, preferredSkills, learnableSkills], index) => ({
    id: `lab-${String(index + 1).padStart(2, '0')}`, name, school: schools[school], department,
    institution: 'CWRU (fictional demonstration record)', scopeVerified: true, topics, preferredSkills, learnableSkills,
    description: `A fictional research group exploring ${topics.join(' and ')}. Demonstration content only.`,
    recruitingStatus: index === 10 ? 'accepting_inquiries' : index === 11 ? 'not_recruiting' : index < 14 ? 'confirmed_opening' : index < 19 ? 'accepting_inquiries' : index < 22 ? 'not_recruiting' : 'unknown',
    acceptsInquiries: index < 19 && ![4, 11].includes(index), claimed: index < 23,
    scheduleKnown: index !== 18 && index !== 23, lastCheckedAt: '2026-10-20',
    provenance: { kind: 'synthetic_fixture', source: `fixture:lab-${index + 1}`, checkedAt: '2026-10-20' }, synthetic,
  }));
}

function buildStudents() {
  const seeds = [
    ['student-01', 'Avery Chen', 'Computational biology explorer', 2, ['genetics', 'computational biology'], ['Python', 'statistics'], ['genomics', 'modeling'], 10, ['mon_pm', 'wed_pm', 'fri_pm'], 9, 3],
    ['student-02', 'Morgan Ellis', 'First-year exploring neuroscience', 1, ['neuroscience', 'psychology'], [], ['behavioral methods', 'data analysis'], 6, ['tue_am', 'thu_am'], 6, 0],
    ['student-03', 'Devon Reed', 'Engineering builder', 3, ['robotics', 'medical devices'], ['CAD', 'Python', 'prototyping'], ['robotics', 'device testing'], 12, ['tue_pm', 'thu_pm', 'fri_pm'], 12, 6],
    ['student-04', 'Jamie Brooks', 'Community health beginner', 2, ['health equity', 'public health'], ['interviewing', 'writing'], ['community research', 'qualitative coding'], 8, ['mon_am', 'wed_am', 'fri_am'], 6, 0],
    ['student-05', 'Taylor Quinn', 'Digital humanities researcher', 2, ['history', 'digital humanities', 'music'], ['writing', 'archival research'], ['text analysis', 'archival research'], 8, ['mon_pm', 'wed_pm'], 6, 0],
    ['student-06', 'Skyler Jordan', 'Environmental data analyst', 3, ['environment', 'ecology'], ['R', 'GIS', 'statistics'], ['field sampling', 'data analysis'], 10, ['tue_am', 'thu_am', 'fri_am'], 9, 3],
    ['student-07', 'Reese Parker', 'Paid research with limited time', 1, ['genetics', 'neuroscience'], ['Python'], ['genomics'], 3, ['fri_pm'], 3, 0],
    ['student-08', 'Robin Lee', 'New student still choosing interests', 1, [], [], [], 8, blocks, 6, 0],
  ];
  return seeds.map(([id, name, label, year, interests, skills, learningGoals, maxWeeklyHours, scheduleBlocks, commitmentMonths, experienceMonths]) => ({
    id, name, label, year, interests, skills, learningGoals, maxWeeklyHours, scheduleBlocks, commitmentMonths,
    experienceMonths, undergraduateVerified: true, resumeStatus: id === 'student-02' || id === 'student-08' ? 'not_uploaded' : 'manual_profile',
    resumeFacts: id === 'student-02' ? [{ kind: 'skill', value: 'Python', confirmed: false, source: 'fictional resume draft', synthetic }] : [],
    preferences: { paidOnly: id === 'student-07' }, synthetic,
  }));
}

function openingSeed(lab, index) {
  const beginner = [1, 3, 5, 7, 8, 9, 12, 13].includes(index);
  const requiredBlocks = index === 0 ? ['mon_pm', 'wed_pm'] : index === 1 ? ['tue_am'] : index === 2 ? ['tue_pm', 'thu_pm'] : index === 3 ? ['mon_am'] : [];
  return {
    id: `opening-${String(index + 1).padStart(2, '0')}`, labId: lab.id,
    title: `${beginner ? 'Research trainee' : 'Undergraduate research assistant'} — ${lab.topics[0]}`,
    tasks: [`Support a supervised ${lab.topics[0]} project`, 'Document methods and discuss findings with a mentor'],
    training: lab.learnableSkills, preferredSkills: lab.preferredSkills, learnableSkills: lab.learnableSkills,
    requiredSkills: beginner ? [] : [lab.preferredSkills[0]], allowedYears: beginner ? [1, 2, 3, 4] : [2, 3, 4],
    requiredExperienceMonths: beginner ? 0 : 3, beginnerFriendly: beginner,
    minWeeklyHours: index === 1 ? 6 : index === 0 ? 8 : index === 2 ? 10 : 6,
    requiredBlocks, commitmentMonths: index === 2 ? 9 : 6,
    compensation: index % 3 === 0 ? 'paid' : index % 3 === 1 ? 'unpaid' : 'unknown',
    status: 'published', confirmedAt: '2026-10-20', closesAt: '2026-11-15',
    applicationRoute: 'demo_portal', location: 'Fictional CWRU campus location', synthetic,
  };
}

function buildOpenings(labs) {
  const openings = labs.slice(0, 14).map(openingSeed);
  openings[10].status = 'paused';
  openings[11].status = 'closed';
  openings[13].requiredBlocks = null;
  openings.push({ ...openingSeed(labs[0], 14), id: 'opening-15', title: 'Expired genomics opening', confirmedAt: '2026-09-01', closesAt: '2026-10-10' });
  openings.push({ ...openingSeed(labs[1], 15), id: 'opening-16', title: 'Draft neuroscience opportunity', status: 'draft' });
  openings.push({ ...openingSeed(labs[18], 16), id: 'opening-17', title: 'Unconfirmed metabolic modeling opportunity', requiredSkills: null, requiredExperienceMonths: null, minWeeklyHours: null, requiredBlocks: null, commitmentMonths: null, confirmedAt: null });
  openings.push({ ...openingSeed(labs[0], 17), id: 'opening-18', title: 'Schedule-incompatible genomics role', requiredSkills: ['Python'], allowedYears: [1, 2, 3, 4], requiredExperienceMonths: 0, requiredBlocks: ['tue_am', 'thu_am'], compensation: 'paid' });
  return openings;
}

function buildPeople(labs) {
  const names = ['Sage Whitman', 'Rowan Hart', 'Emery Vale', 'Drew Cameron', 'Alex Monroe', 'Blair Sutton', 'Casey Nolan', 'Quinn Marlow', 'Ellis Winter', 'Dakota Hayes', 'Finley Mercer', 'Harper Stone', 'Indigo Blake', 'Jules Arden', 'Kendall Rivers', 'Lane Foster', 'Marin Wells', 'Noel Ashton', 'Oakley Grant', 'Peyton Cole', 'Remy Linden', 'Shiloh Dean', 'Tatum Wren', 'Wren Hollis'];
  const primary = labs.map((lab, index) => ({
    id: `person-${String(index + 1).padStart(2, '0')}`, labId: lab.id, name: `Dr. ${names[index]}`,
    role: 'PI', affiliationVerified: true, authorized: index !== 22, accountClaimed: index !== 23,
    acceptsInquiries: lab.acceptsInquiries, email: `person-${index + 1}@example.invalid`, synthetic,
  }));
  const extras = ['River Bell', 'Cameron Fox', 'Jordan Avery', 'Ashley Lane', 'Charlie Grey', 'Sam Dale'].map((name, index) => ({
    id: `person-${25 + index}`, labId: labs[index].id, name, role: 'Delegated recruiter',
    affiliationVerified: index !== 5, authorized: index !== 4, accountClaimed: index !== 3,
    acceptsInquiries: true, email: `recruiter-${index + 1}@example.invalid`, synthetic,
  }));
  return [...primary, ...extras];
}

function buildScenarios() {
  return [
    ['topic-shift', 'student-01', 'Compare genetics interests with robotics interests; the ordering should change.', { topics: ['robotics', 'engineering'] }],
    ['no-resume-beginner', 'student-02', 'A first-year can discover beginner training without a resume.', { beginnerOnly: true }],
    ['no-profile-cold-start', 'student-08', 'Exploratory suggestions carry no fabricated profile explanation.', {}],
    ['no-match', 'student-07', 'Paid-only and three-hour availability produce an honest no-opening state.', {}],
    ['schedule-conflict', 'student-01', 'Genomics opening-18 is excluded despite interest and skill overlap.', {}],
    ['expired-opening', 'student-01', 'Opening-15 cannot appear as actionable after its expiry.', {}],
    ['people-permission', 'student-01', 'Unauthorized, unclaimed, and unverified people never enter the feed.', {}],
    ['draft-skill', 'student-02', 'An unconfirmed extracted Python fact does not affect recommendation scoring.', {}],
    ['identity-invariance', 'student-01', 'Changing name, GPA, contact fields, or private messages leaves ranking unchanged.', {}],
    ['unknown-filter', 'student-01', 'Unknown compensation cannot pass paid-only filtering.', { paidOnly: true }],
  ].map(([id, studentId, description, options]) => ({ id, studentId, description, options, synthetic }));
}

function csv(rows) {
  const keys = uniqueKeys(rows);
  const cell = value => `"${String(typeof value === 'object' ? JSON.stringify(value) : value ?? '').replaceAll('"', '""')}"`;
  return `${keys.map(cell).join(',')}\n${rows.map(row => keys.map(key => cell(row[key])).join(',')).join('\n')}\n`;
}

function uniqueKeys(rows) {
  return [...new Set(rows.flatMap(row => Object.keys(row)))];
}

function save(name, value) {
  writeFileSync(resolve(output, name), `${JSON.stringify(value, null, 2)}\n`);
}

mkdirSync(output, { recursive: true });
const labs = buildLabs();
const students = buildStudents();
const openings = buildOpenings(labs);
const people = buildPeople(labs);
const scenarios = buildScenarios();
const metadata = {
  title: 'CWRU Research Connect fictional simulation', asOf, seed: 20261027,
  rankingVersion: RANKING_VERSION, weights: DEFAULT_WEIGHTS, synthetic,
  warning: 'Fictional demonstration only. No real people, labs, openings, recruiting authority, or placement outcomes.',
  topics: [...new Set(labs.flatMap(lab => lab.topics))].sort(), scheduleBlocks: blocks,
  scheduleLabels: Object.fromEntries(blocks.map(block => [block, `${({ mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday' })[block.slice(0, 3)]} ${block.endsWith('am') ? 'morning' : 'afternoon'}`])),
};
const dataset = { metadata, students, labs, openings, people, scenarios };
save('dataset.json', dataset);
for (const [name, rows] of Object.entries({ students, labs, openings, people, scenarios })) {
  save(`${name}.json`, rows);
  writeFileSync(resolve(output, `${name}.csv`), csv(rows));
}
save('sample-recommendations.json', students.map(student => ({ studentId: student.id, ...recommend(dataset, student) })));
save('scenario-results.json', scenarios.map(scenario => ({ scenarioId: scenario.id, studentId: scenario.studentId, ...recommend(dataset, students.find(student => student.id === scenario.studentId), scenario.options) })));
console.log(`Generated ${students.length} students, ${labs.length} labs, ${openings.length} openings, ${people.length} people, and ${scenarios.length} scenarios.`);
