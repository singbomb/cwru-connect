export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

const list = values => values?.length ? values.map(escapeHtml).join(', ') : 'None listed';
const keyFor = item => `${item.type}:${item.id}`;
const labels = { confirmed_opening: 'Open position', accepting_inquiries: 'Accepting inquiries',
  not_recruiting: 'Not recruiting', unknown: 'Status unknown' };

export function profileMarkup(student) {
  return `<p class="profile-name">${escapeHtml(student.name)}</p>
    <p class="profile-meta">Year ${student.year} · ${escapeHtml(student.label)}</p>
    <div class="resume-section"><h3>Skills</h3><p>${list(student.skills)}</p></div>
    <div class="resume-section"><h3>Interests</h3><p>${list([...new Set([...student.interests, ...student.learningGoals])])}</p></div>`;
}

function icon(name) {
  const paths = { arrow: '<path d="M4 10h12m-5-5 5 5-5 5"/>',
    bookmark: '<path d="M5.5 3.5h9v13l-4.5-3-4.5 3Z"/>',
    check: '<path d="m4.5 10.5 3.5 3.5 7.5-8"/>',
    more: '<circle cx="5" cy="10" r="0.9"/><circle cx="10" cy="10" r="0.9"/><circle cx="15" cy="10" r="0.9"/>' };
  return `<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function formatDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  return match ? `${months[Number(match[2]) - 1]} ${Number(match[3])}, ${match[1]}` : value || '';
}

const sentence = value => value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
const cleanReason = reason => reason?.replace('Confirmed transferable skills:', 'Matching skills:').replace('Shared interests:', 'Matching interests:');

export function displayTitle(item) {
  if (item.type !== 'opening') return item.title;
  return sentence(item.title.split(' — ')[0]);
}

function openingFor(item, dataset) {
  return dataset.openings.find(value => value.id === (item.type === 'opening' ? item.id : item.openingId ?? item.action?.targetId));
}

function compensationLabel(opening) {
  return opening.compensation === 'unknown' ? 'Pay not listed' : opening.compensation === 'paid' ? 'Paid' : 'Unpaid';
}

function rowMetadata(item, dataset) {
  const lab = dataset.labs.find(value => value.id === item.labId);
  if (item.type !== 'opening') return lab.topics.map(topic => `<li>${escapeHtml(sentence(topic))}</li>`).join('');
  const opening = openingFor(item, dataset);
  const area = item.title.split(' — ')[1];
  return [`${opening.minWeeklyHours} hrs/week`, compensationLabel(opening), `${opening.commitmentMonths} months`, area && sentence(area),
    opening.beginnerFriendly && 'Beginner friendly']
    .filter(Boolean).map((value, index) => `<li${index === 1 && opening.compensation === 'paid' ? ' class="meta-paid"' : ''}>${escapeHtml(value)}</li>`).join('');
}

function saveMarkup(item, feedback) {
  const key = escapeHtml(keyFor(item));
  const saved = feedback.saved.includes(keyFor(item));
  return `<button class="save-action" data-action="save" data-key="${key}" aria-pressed="${saved}" aria-label="${saved ? 'Unsave' : 'Save'} ${escapeHtml(displayTitle(item))}">${icon('bookmark')}<span>${saved ? 'Saved' : 'Save'}</span></button>`;
}

function identityMarkup(item, dataset, feedback) {
  const key = escapeHtml(keyFor(item));
  const lab = dataset.labs.find(value => value.id === item.labId);
  const identity = item.type === 'person' ? item.title.replace(/^Dr\.\s*/, '') : item.labName;
  const initials = identity.split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase();
  const subtitle = item.type === 'opening' ? `${item.labName} · ${lab.school}`
    : item.type === 'lab' ? `${item.department} · ${lab.school}` : `${item.role} · ${item.labName}`;
  return `<div class="identity-line"><div class="identity-mark" aria-hidden="true">${escapeHtml(initials)}</div><div class="identity-copy">
    <h3 class="result-title"><button class="title-action" data-action="preview" data-key="${key}" ${item.action.enabled ? '' : 'disabled'}>${escapeHtml(displayTitle(item))}</button></h3>
    <p class="result-subtitle">${escapeHtml(subtitle)}</p></div>
    ${saveMarkup(item, feedback)}</div>`;
}

function statusMarkup(item) {
  const status = item.type === 'opening' ? 'confirmed_opening' : item.status;
  const statusClass = status === 'confirmed_opening' ? 'open' : status === 'accepting_inquiries' ? 'inquiry' : status === 'not_recruiting' ? 'closed' : 'unknown';
  return `<span class="status status-${statusClass}">${labels[status] ?? labels.unknown}</span>`;
}

function footerMarkup(item, dataset) {
  const key = escapeHtml(keyFor(item));
  const actions = { preview_application: 'View position', preview_inquiry: 'View contact', view_opening: 'View position', explore_lab: 'View lab' };
  const opening = item.type === 'opening' ? openingFor(item, dataset) : null;
  const date = opening ? `<span class="record-note">${opening.closesAt ? `Apply by ${escapeHtml(formatDate(opening.closesAt))}` : `Updated ${escapeHtml(formatDate(item.confirmedAt))}`}</span>` : '';
  return `<div class="result-footer"><div class="result-state">${statusMarkup(item)}${date}</div>
    <div class="result-actions"><details class="row-more"><summary aria-label="More actions for ${escapeHtml(displayTitle(item))}">${icon('more')}</summary><div class="secondary-actions">
    <button data-action="dismiss" data-key="${key}" aria-label="Hide ${escapeHtml(displayTitle(item))}">Hide from results</button>
    <button data-action="contacted" data-key="${key}" aria-label="Mark ${escapeHtml(displayTitle(item))} as contacted">Mark as contacted</button></div></details>
    <button class="result-cta" data-action="preview" data-key="${key}" ${item.action.enabled ? '' : 'disabled'}>${escapeHtml(actions[item.action.kind] || item.action.label)}</button></div></div>`;
}

export function resultMarkup(item, dataset, feedback) {
  const reason = cleanReason(item.reasons[0]);
  return `<article class="result-row result-row--${item.type}" data-result-key="${escapeHtml(keyFor(item))}" data-result-type="${item.type}">
    <div class="result-main">${identityMarkup(item, dataset, feedback)}
    <ul class="metadata" aria-label="Details">${rowMetadata(item, dataset)}</ul>
    ${reason ? `<p class="evidence">${icon('check')}<span><span class="visually-hidden">Why this appears: </span>${escapeHtml(reason)}</span></p>` : ''}
    </div>${footerMarkup(item, dataset)}</article>`;
}

function emptyMarkup(title) {
  const recovery = title === 'People'
    ? 'Try turning off paid-only or beginner-only, reset hidden items, or adjust research interests. Hours and time blocks only filter openings.'
    : 'Try more hours, additional available time blocks, or turn off an explicit filter. Broader lab discovery may still help.';
  return `<div class="empty-state"><h3>No ${title.toLowerCase()} with these settings</h3><p>${recovery}</p><button class="button-secondary" data-action="restore">Restore profile preferences</button></div>`;
}

function group(title, items, dataset, feedback, type) {
  const visible = items;
  const render = item => resultMarkup(item, dataset, feedback);
  const initialCount = type === 'opening' ? 4 : 6;
  const initial = visible.slice(0, initialCount);
  const remaining = visible.slice(initialCount);
  return `<section class="feed-group feed-group--${type}" aria-label="${escapeHtml(title)}"><div class="group-heading"><h2>${escapeHtml(title)}</h2><span>${items.length}</span></div>
    ${visible.length ? `<div class="feed-items feed-items--${type}">${initial.map(render).join('')}</div>` : emptyMarkup(title)}
    ${remaining.length ? `<details class="more-results"><summary><span class="show-more-label">Show ${remaining.length} more</span><span class="show-less-label">Show fewer</span><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m5 8 5 5 5-5"/></svg></summary><div class="feed-items feed-items--${type}">${remaining.map(item => resultMarkup(item, dataset, feedback)).join('')}</div></details>` : ''}</section>`;
}

export function resultsMarkup(result, dataset, feedback, view, savedOnly) {
  const selected = items => savedOnly ? items.filter(item => feedback.saved.includes(keyFor(item))) : items;
  const available = view === 'people' ? result.people : view === 'labs' ? result.labs : result.opportunities;
  if (savedOnly && !selected(available).length) return '<div class="empty-state"><h2>No saved items in this view</h2><p>Turn off Saved only to browse suggestions, then save an item. A saved item can also disappear when it no longer meets a strict filter.</p></div>';
  if (view === 'people') return group('People', selected(result.people), dataset, feedback, 'person');
  if (view === 'labs') return group('Labs', selected(result.labs), dataset, feedback, 'lab');
  const openings = view === 'home' ? selected(result.opportunities).slice(0, 6) : selected(result.opportunities);
  return group('Open positions', openings, dataset, feedback, 'opening');
}

export function exclusionsMarkup(excluded) {
  return excluded.map(item => `<div class="exclusion-row"><strong>${escapeHtml(item.title)}</strong><ul>${item.reasons.map(reason => `<li>${escapeHtml(reason)}</li>`).join('')}</ul></div>`).join('');
}

function fieldsMarkup(fields) {
  return `<dl class="preview-fields">${fields.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>`;
}

export function previewMarkup(item, dataset, student) {
  const lab = dataset.labs.find(value => value.id === item.labId);
  const opening = openingFor(item, dataset);
  const subtitle = item.type === 'person' ? `${item.role} · ${lab.name}` : item.type === 'lab' ? `${lab.department} · ${lab.school}` : `${lab.name} · ${lab.school}`;
  const fields = [['Lab', lab.name], ['Department', `${lab.department}, ${lab.school}`], ['Research areas', lab.topics.map(sentence).join(', ')]];
  if (opening) fields.push(['Commitment', `${opening.minWeeklyHours} hours per week for ${opening.commitmentMonths} months`],
    ['Compensation', compensationLabel(opening)],
    ['Schedule', opening.requiredBlocks?.length ? opening.requiredBlocks.map(block => dataset.metadata.scheduleLabels[block]).join(', ') : 'Flexible'],
    ['Required skills', opening.requiredSkills?.join(', ') || 'None listed'],
    ['Training provided', opening.training.map(sentence).join(', ')]);
  if (opening?.closesAt) fields.push(['Application deadline', formatDate(opening.closesAt)]);
  if (item.type === 'person') fields.push(['Contact', item.title], ['Role', item.role]);
  const application = item.action.kind === 'preview_application';
  return `<p class="preview-subtitle">${escapeHtml(subtitle)}</p>
    <div class="preview-status">${statusMarkup(item)}${opening ? `<span class="record-note">Updated ${escapeHtml(formatDate(opening.confirmedAt))}</span>` : ''}</div>
    ${opening ? `<section class="preview-section"><h3>Responsibilities</h3><ul>${opening.tasks.map(task => `<li>${escapeHtml(task)}</li>`).join('')}</ul></section>` : ''}
    ${item.type === 'lab' ? `<section class="preview-section"><h3>About the lab</h3><p>${escapeHtml(lab.description)}</p></section>` : ''}
    <section class="preview-section"><h3>Details</h3>${fieldsMarkup(fields)}</section>
    <section class="preview-section"><h3>Why this is recommended</h3><ul class="preview-reasons">${item.reasons.map(reason => `<li>${icon('check')}<span>${escapeHtml(cleanReason(reason))}</span></li>`).join('')}</ul></section>
    ${application ? `<section class="preview-section"><h3>Your profile</h3>${fieldsMarkup([['Name', student.name], ['Skills', student.skills.join(', ') || 'None listed']])}</section>` : ''}`;
}
