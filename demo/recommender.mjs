export const RANKING_VERSION = 'rules-demo-v1';
export const DEFAULT_WEIGHTS = Object.freeze({ topics: 5, skills: 3, learning: 2, saved: 1 });

const intersect = (left = [], right = []) => left.filter(value => right.includes(value));
const unique = values => [...new Set(values)];
const feedbackKey = (type, id) => `${type}:${id}`;
const finiteInRange = (value, maximum) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= maximum;
const stringArray = values => Array.isArray(values) && values.every(value => typeof value === 'string' && value.trim());
function dateValue(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value ? timestamp : NaN;
}

function validateNumber(name, value, maximum, integer = false) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > maximum || (integer && !Number.isInteger(value))) {
    throw new RangeError(`${name} must be a finite ${integer ? 'integer' : 'number'} between 0 and ${maximum}`);
  }
}

function validateStrings(name, values, pattern) {
  if (!Array.isArray(values) || values.length > 1000 || values.some(value => typeof value !== 'string' || !value.trim() || value.length > 200 || (pattern && !pattern.test(value)))) {
    throw new TypeError(`${name} must be an array of valid nonempty strings`);
  }
}

function validateOptions(options, config) {
  if (!Number.isFinite(dateValue(config.asOf))) throw new RangeError('asOf must be a valid calendar date in YYYY-MM-DD format');
  for (const [name, maximum] of [['maxWeeklyHours', 168], ['minimumCommitmentMonths', 120], ['limit', 1000]]) {
    if (Object.hasOwn(options, name) && options[name] !== undefined) validateNumber(name, options[name], maximum, name === 'limit');
    if (config[name] != null) validateNumber(name, config[name], maximum, name === 'limit');
  }
  if (config.limit < 1) throw new RangeError('limit must be at least 1');
  for (const name of ['paidOnly', 'beginnerOnly']) {
    if (Object.hasOwn(options, name) && options[name] !== undefined && typeof options[name] !== 'boolean') throw new TypeError(`${name} must be a boolean`);
    if (typeof config[name] !== 'boolean') throw new TypeError(`${name} must be a boolean`);
  }
  for (const name of ['topics', 'scheduleBlocks', 'saved']) {
    if (Object.hasOwn(options, name) && options[name] !== undefined) validateStrings(name, options[name]);
  }
  validateStrings('topics', config.topics);
  if (config.scheduleBlocks != null) validateStrings('scheduleBlocks', config.scheduleBlocks, /^(mon|tue|wed|thu|fri)_(am|pm)$/);
  if (!config.feedback || typeof config.feedback !== 'object' || Array.isArray(config.feedback)) throw new TypeError('feedback must be an object');
  for (const name of ['dismissed', 'contacted']) validateStrings(`feedback.${name}`, config.feedback[name] === undefined ? [] : config.feedback[name], /^(opening|lab|person):[a-zA-Z0-9_-]+$/);
  validateStrings('saved', config.saved, /^(opening|lab|person):[a-zA-Z0-9_-]+$/);
  for (const name of ['weights', 'feedback']) {
    if (Object.hasOwn(options, name) && options[name] !== undefined && (!options[name] || typeof options[name] !== 'object' || Array.isArray(options[name]))) throw new TypeError(`${name} must be an object`);
  }
  for (const [name, value] of Object.entries(config.weights)) {
    if (!Object.hasOwn(DEFAULT_WEIGHTS, name) || typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new RangeError('weights must contain known keys with finite nonnegative numbers');
  }
}

function activeOpening(opening, asOf) {
  const now = dateValue(asOf);
  const confirmed = dateValue(opening.confirmedAt);
  const deadline = dateValue(opening.closesAt);
  const expired = Number.isFinite(deadline) && now >= deadline;
  if (opening.status !== 'published') return `Opening is ${opening.status}`;
  if (!Number.isFinite(confirmed) || confirmed > now) return 'Confirmation date unavailable or invalid';
  if (opening.closesAt != null && !Number.isFinite(deadline)) return 'Closing date is invalid';
  if (now >= confirmed + 30 * 86400000 || expired) return 'Opening confirmation or deadline has expired';
  return null;
}

function confirmedSkills(student) {
  const facts = (student.resumeFacts ?? []).filter(fact => fact.confirmed && fact.kind === 'skill');
  return unique([...(student.skills ?? []), ...facts.map(fact => fact.value)]);
}

function settings(student, options) {
  return {
    paidOnly: options.paidOnly ?? student.preferences?.paidOnly ?? false,
    beginnerOnly: options.beginnerOnly ?? false,
    maxWeeklyHours: options.maxWeeklyHours ?? student.maxWeeklyHours,
    scheduleBlocks: options.scheduleBlocks ?? student.scheduleBlocks,
    minimumCommitmentMonths: options.minimumCommitmentMonths ?? student.commitmentMonths,
    topics: options.topics ?? student.interests ?? [],
    skills: confirmedSkills(student),
    learningGoals: student.learningGoals ?? [],
    weights: { ...DEFAULT_WEIGHTS, ...options.weights },
    feedback: options.feedback ?? { dismissed: [], contacted: [] },
    saved: options.saved ?? [],
    asOf: options.asOf === undefined ? '2026-10-27' : options.asOf,
    limit: options.limit ?? 6,
  };
}

function eligibilityIssues(opening, student, config) {
  const issues = [];
  if (config.paidOnly && opening.compensation !== 'paid') issues.push('Paid-only filter: compensation is unpaid or unknown');
  if (config.beginnerOnly && opening.beginnerFriendly !== true) issues.push('Beginner-only filter: beginner eligibility is unconfirmed');
  const yearsKnown = Array.isArray(opening.allowedYears) && opening.allowedYears.every(year => finiteInRange(year, 8) && Number.isInteger(year) && year >= 1);
  if (!yearsKnown || !opening.allowedYears.includes(student.year)) issues.push('Academic year does not meet confirmed eligibility');
  if (!finiteInRange(opening.requiredExperienceMonths, 1200)) issues.push('Minimum experience requirement is unknown or invalid');
  else if (!finiteInRange(student.experienceMonths, 1200) || student.experienceMonths < opening.requiredExperienceMonths) {
    issues.push('Minimum research experience is not met');
  }
  if (!stringArray(opening.requiredSkills)) issues.push('Required skills are unknown or invalid');
  else if (opening.requiredSkills.some(skill => !config.skills.includes(skill))) issues.push('One or more required skills are not confirmed');
  return issues;
}

function practicalIssues(opening, config) {
  const issues = [];
  if (config.maxWeeklyHours != null && (!finiteInRange(opening.minWeeklyHours, 168) || opening.minWeeklyHours > config.maxWeeklyHours)) {
    issues.push('Weekly hours exceed availability or are unknown');
  }
  if (config.scheduleBlocks != null && (!stringArray(opening.requiredBlocks) || opening.requiredBlocks.some(block => !config.scheduleBlocks.includes(block)))) {
    issues.push('Required schedule blocks conflict or are unknown');
  }
  if (config.minimumCommitmentMonths != null && (!finiteInRange(opening.commitmentMonths, 120) || opening.commitmentMonths > config.minimumCommitmentMonths)) {
    issues.push('Required duration exceeds commitment or is unknown');
  }
  return issues;
}

function relevance(entity, config) {
  const topicMatches = intersect(config.topics, entity.topics ?? []);
  const skillMatches = intersect(config.skills, entity.preferredSkills ?? []);
  const learningMatches = intersect(config.learningGoals, entity.learnableSkills ?? []);
  const saved = config.saved.includes(feedbackKey(entity.type ?? 'lab', entity.id)) ? 1 : 0;
  const components = { topics: topicMatches.length, skills: skillMatches.length, learning: learningMatches.length, saved };
  const score = Object.entries(components).reduce((total, [key, value]) => total + value * config.weights[key], 0);
  const reasons = [];
  if (topicMatches.length) reasons.push(`Shared interests: ${topicMatches.join(', ')}`);
  if (skillMatches.length) reasons.push(`Confirmed transferable skills: ${skillMatches.join(', ')}`);
  if (learningMatches.length) reasons.push(`Training supports your goals: ${learningMatches.join(', ')}`);
  if (saved) reasons.push('You saved this item');
  if (!reasons.length) reasons.push('Exploratory suggestion: add interests or skills to personalize');
  return { score, components, reasons, evidence: [...topicMatches, ...skillMatches, ...learningMatches] };
}

function suppressed(type, id, config) {
  const key = feedbackKey(type, id);
  return [...(config.feedback.dismissed ?? []), ...(config.feedback.contacted ?? [])].includes(key);
}

function rank(items, limit) {
  return items.sort((left, right) => right.score - left.score || left.id.localeCompare(right.id)).slice(0, limit);
}

function openingCandidates(dataset, student, config, excluded) {
  const candidates = [];
  for (const opening of dataset.openings) {
    const lab = dataset.labs.find(item => item.id === opening.labId);
    const issues = [activeOpening(opening, config.asOf), ...eligibilityIssues(opening, student, config), ...practicalIssues(opening, config)].filter(Boolean);
    if (!lab?.scopeVerified || !lab.claimed) issues.push('Lab ownership is not confirmed in this simulation');
    if (issues.length) {
      excluded.push({ id: opening.id, type: 'opening', title: opening.title, labId: opening.labId, reasons: issues, synthetic: true });
      continue;
    }
    const entity = { ...opening, type: 'opening', topics: lab.topics };
    candidates.push({
      id: opening.id, type: 'opening', title: opening.title, openingId: opening.id,
      labId: lab.id, labName: lab.name, status: 'confirmed_opening',
      action: { kind: 'preview_application', label: 'Preview demo application', enabled: true },
      ...relevance(entity, config), caveats: ['Eligibility checked against synthetic fields; selection is never guaranteed'],
      minWeeklyHours: opening.minWeeklyHours, compensation: opening.compensation,
      confirmedAt: opening.confirmedAt, closesAt: opening.closesAt, synthetic: true,
    });
  }
  return candidates;
}

function effectiveLabStatus(lab, currentOpenings) {
  if (currentOpenings.length) return 'confirmed_opening';
  if (lab.recruitingStatus !== 'confirmed_opening') return lab.recruitingStatus;
  return lab.acceptsInquiries ? 'accepting_inquiries' : 'unknown';
}

function labCaveats(lab, eligibleOpenings, currentOpenings) {
  const caveats = [];
  if (!lab.claimed) caveats.push('Unclaimed sourced profile; contact authority is unverified');
  if (lab.recruitingStatus === 'unknown') caveats.push('Recruiting status is unknown');
  if (lab.recruitingStatus === 'not_recruiting') caveats.push('Not recruiting; research exploration only');
  if (lab.recruitingStatus === 'accepting_inquiries') caveats.push('Interest inquiries accepted; no confirmed opening');
  if (!currentOpenings.length) caveats.push('No current confirmed opening is available in this snapshot');
  else if (!eligibleOpenings.length) caveats.push('Current openings do not meet your confirmed constraints');
  if (lab.scheduleKnown === false) caveats.push('Lab-wide schedule is unknown; verify before making a commitment');
  return caveats;
}

function labCandidates(dataset, openings, config) {
  return dataset.labs.filter(lab => lab.scopeVerified).flatMap(lab => {
    const eligible = openings.filter(opening => opening.labId === lab.id);
    const current = dataset.openings.filter(opening => opening.labId === lab.id && !activeOpening(opening, config.asOf));
    const status = effectiveLabStatus(lab, current);
    if ((config.paidOnly || config.beginnerOnly) && !eligible.length) return [];
    return [{
      id: lab.id, type: 'lab', title: lab.name, labId: lab.id, labName: lab.name,
      status, ...relevance({ ...lab, type: 'lab' }, config),
      action: { kind: 'explore_lab', label: 'Explore lab', enabled: true },
      caveats: labCaveats({ ...lab, recruitingStatus: status }, eligible, current), department: lab.department,
      confirmedAt: lab.lastCheckedAt, synthetic: true,
    }];
  });
}

function personAction(person, lab, openings) {
  const eligible = openings.find(opening => opening.labId === lab.id);
  if (person.acceptsInquiries && lab.acceptsInquiries && ['accepting_inquiries', 'confirmed_opening'].includes(lab.recruitingStatus)) {
    return { kind: 'preview_inquiry', label: 'Preview demo inquiry', enabled: true };
  }
  if (eligible) return { kind: 'view_opening', label: 'View matching opening', enabled: true, targetId: eligible.id };
  return { kind: 'explore_lab', label: 'Explore lab', enabled: true };
}

function peopleCandidates(dataset, labs, openings, config) {
  return dataset.people.flatMap(person => {
    const lab = dataset.labs.find(item => item.id === person.labId);
    const visible = person.affiliationVerified && person.authorized && person.accountClaimed && lab?.scopeVerified && lab.claimed;
    if (!visible) return [];
    const labResult = labs.find(item => item.id === lab.id);
    if (!labResult) return [];
    const action = personAction(person, { ...lab, recruitingStatus: labResult.status }, openings);
    return [{
      id: person.id, type: 'person', personId: person.id, title: person.name,
      labId: lab.id, labName: lab.name, role: person.role, status: labResult.status,
      ...relevance({ ...lab, id: person.id, type: 'person' }, config), action,
      caveats: action.kind === 'explore_lab' ? ['General inquiries are unavailable; view research context only'] : ['Contact permission is simulated; no message will be sent'],
      synthetic: true,
    }];
  });
}

export function recommend(dataset, student, options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new TypeError('options must be an object');
  const config = settings(student, { asOf: dataset.metadata.asOf, ...options });
  validateOptions(options, config);
  config.topics = unique(config.topics);
  const excluded = [];
  const openings = openingCandidates(dataset, student, config, excluded);
  const labs = labCandidates(dataset, openings, config);
  const people = peopleCandidates(dataset, labs, openings, config);
  return {
    opportunities: rank(openings.filter(item => !suppressed('opening', item.id, config)), config.limit),
    labs: rank(labs.filter(item => !suppressed('lab', item.id, config)), config.limit),
    people: rank(people.filter(item => !suppressed('person', item.id, config)), config.limit), excluded, rankingVersion: RANKING_VERSION,
    asOf: config.asOf, synthetic: true,
  };
}
