export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

const list = values => values?.length ? values.map(escapeHtml).join(', ') : 'None listed';
const keyFor = item => `${item.type}:${item.id}`;
const labels = { confirmed_opening: 'Has a current opening', accepting_inquiries: 'Accepting inquiries',
  not_recruiting: 'Not recruiting', unknown: 'Recruiting unknown' };

export function profileMarkup(student) {
  return `<p class="profile-name">${escapeHtml(student.name)}</p>
    <p class="profile-meta">Year ${student.year} · ${escapeHtml(student.label)}</p>
    <div class="resume-section"><h3>Hard skills</h3><p>${list(student.skills)}</p></div>
    <div class="resume-section"><h3>Interests</h3><p>${list([...new Set([...student.interests, ...student.learningGoals])])}</p></div>`;
}

function icon(name) {
  const paths = { arrow: '<path d="M4 10h12m-5-5 5 5-5 5"/>',
    bookmark: '<path d="M5 3h10v14l-5-3-5 3Z"/>' };
  return `<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}

function rowMetadata(item, dataset) {
  const lab = dataset.labs.find(value => value.id === item.labId);
  if (item.type !== 'opening') return `<span>${escapeHtml(lab.school)}</span>`;
  const opening = dataset.openings.find(value => value.id === item.id);
  const compensation = opening.compensation === 'unknown' ? 'Compensation unknown' : opening.compensation === 'paid' ? 'Paid' : 'Unpaid';
  return `<span><strong>${opening.minWeeklyHours}</strong> hours/week</span>
    <span class="${opening.compensation === 'paid' ? 'meta-paid' : ''}">${compensation}</span>
    <span><strong>${opening.commitmentMonths}</strong> months</span>`;
}

function saveMarkup(item, feedback) {
  const key = escapeHtml(keyFor(item));
  const saved = feedback.saved.includes(keyFor(item));
  return `<button class="save-action" data-action="save" data-key="${key}" aria-pressed="${saved}" aria-label="${saved ? 'Unsave' : 'Save'} ${escapeHtml(item.title)}">${icon('bookmark')}<span>${saved ? 'Saved' : 'Save'}</span></button>`;
}

function identityMarkup(item, dataset, feedback) {
  const key = escapeHtml(keyFor(item));
  const identity = item.type === 'person' ? item.title.replace(/^Dr\.\s*/, '') : item.labName;
  const initials = identity.split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase();
  const parts = item.type === 'opening' ? item.title.split(' — ') : [item.title];
  const title = parts.length > 1 ? parts.slice(1).join(' — ') : item.title;
  const displayTitle = title.charAt(0).toUpperCase() + title.slice(1);
  const subtitle = item.type === 'lab' ? item.department : item.labName;
  return `<div class="identity-line"><div class="identity-mark" aria-hidden="true">${escapeHtml(initials)}</div><div class="identity-copy">
    <h3 class="result-title"><button class="title-action" data-action="preview" data-key="${key}" aria-label="View ${escapeHtml(item.title)}" ${item.action.enabled ? '' : 'disabled'}><span class="result-focus">${escapeHtml(displayTitle)}</span></button></h3>
    ${parts.length > 1 ? `<p class="result-role">${escapeHtml(parts[0])}</p>` : item.type === 'person' ? `<p class="result-role">${escapeHtml(item.role)}</p>` : ''}
    <p class="result-subtitle">${escapeHtml(subtitle)}</p></div>
    ${item.type === 'opening' ? '' : saveMarkup(item, feedback)}</div>`;
}

function footerMarkup(item, feedback) {
  const key = escapeHtml(keyFor(item));
  const status = item.type === 'opening' ? 'Current opening' : labels[item.status] ?? 'Recruiting unknown';
  const statusClass = item.status === 'confirmed_opening' ? 'open' : item.status === 'accepting_inquiries' ? 'inquiry' : 'unknown';
  const actions = { preview_application: 'View opening', preview_inquiry: 'View contact', view_opening: 'View opening', explore_lab: 'View lab' };
  const date = item.type === 'opening' ? `<span class="record-note">Updated ${escapeHtml(item.confirmedAt)}</span>` : '';
  return `<div class="result-footer"><div class="result-state"><span class="status status-${statusClass}">${status}</span>${date}</div>
    <div class="result-actions">${item.type === 'opening' ? saveMarkup(item, feedback) : ''}<button class="result-cta" data-action="preview" data-key="${key}" ${item.action.enabled ? '' : 'disabled'}>${escapeHtml(actions[item.action.kind] || item.action.label)}${icon('arrow')}</button>
    <details class="row-more"><summary aria-label="More actions for ${escapeHtml(item.title)}">More</summary><div class="secondary-actions">
    <button class="button-quiet" data-action="dismiss" data-key="${key}" aria-label="Dismiss ${escapeHtml(item.title)}">Dismiss</button>
    <button class="button-quiet" data-action="contacted" data-key="${key}" aria-label="Mark ${escapeHtml(item.title)} already contacted">Already contacted</button></div></details></div></div>`;
}

export function resultMarkup(item, dataset, feedback) {
  const lab = dataset.labs.find(value => value.id === item.labId);
  return `<article class="result-row result-row--${item.type}" data-result-key="${escapeHtml(keyFor(item))}" data-result-type="${item.type}">
    <div class="result-main">${identityMarkup(item, dataset, feedback)}
    <div class="metadata">${rowMetadata(item, dataset)}</div>
    ${item.type !== 'opening' ? `<div class="topic-list">${lab.topics.map(topic => `<span>${escapeHtml(topic)}</span>`).join('')}</div>` : ''}
    <div class="evidence"><p><span class="visually-hidden">Why this appears: </span><span class="reason-line">${escapeHtml(item.reasons[0]?.replace('Confirmed transferable skills:', 'Matching skills:').replace('Shared interests:', 'Matching interests:'))}</span></p></div>
    </div>${footerMarkup(item, feedback)}</article>`;
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
  const initialCount = type === 'opening' ? 2 : 6;
  const initial = visible.slice(0, initialCount);
  const remaining = visible.slice(initialCount);
  return `<section class="feed-group feed-group--${type}" aria-label="${escapeHtml(title)}"><div class="group-heading"><h2>${escapeHtml(title)}</h2><span>${items.length}</span></div>
    ${visible.length ? `<div class="feed-items feed-items--${type}">${initial.map(render).join('')}</div>` : emptyMarkup(title)}
    ${remaining.length ? `<details class="more-results"><summary><span class="show-more-label">Show more</span><span class="show-less-label">Show less</span><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m5 8 5 5 5-5"/></svg></summary><div class="feed-items feed-items--${type}">${remaining.map(item => resultMarkup(item, dataset, feedback)).join('')}</div></details>` : ''}</section>`;
}

export function resultsMarkup(result, dataset, feedback, view, savedOnly) {
  const selected = items => savedOnly ? items.filter(item => feedback.saved.includes(keyFor(item))) : items;
  const available = view === 'people' ? result.people : view === 'labs' ? result.labs : result.opportunities;
  if (savedOnly && !selected(available).length) return '<div class="empty-state"><h2>No saved items in this view</h2><p>Turn off Saved only to browse suggestions, then save an item. A saved item can also disappear when it no longer meets a strict filter.</p></div>';
  if (view === 'people') return group('People', selected(result.people), dataset, feedback, 'person');
  if (view === 'labs') return group('Explore labs', selected(result.labs), dataset, feedback, 'lab');
  const openings = view === 'home' ? selected(result.opportunities).slice(0, 6) : selected(result.opportunities);
  return group('Current openings', openings, dataset, feedback, 'opening');
}

export function exclusionsMarkup(excluded) {
  return excluded.map(item => `<div class="exclusion-row"><strong>${escapeHtml(item.title)}</strong><ul>${item.reasons.map(reason => `<li>${escapeHtml(reason)}</li>`).join('')}</ul></div>`).join('');
}

function fieldsMarkup(fields) {
  return `<dl class="preview-fields">${fields.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>`;
}

export function previewMarkup(item, dataset, student) {
  const lab = dataset.labs.find(value => value.id === item.labId);
  const openingId = item.openingId ?? item.action.targetId;
  const opening = dataset.openings.find(value => value.id === openingId);
  const common = [['Lab', lab.name], ['Research', lab.topics.join(', ')]];
  if (opening) common.push(['Tasks', opening.tasks.join('; ')], ['Training', opening.training.join(', ')],
    ['Required skills', opening.requiredSkills?.join(', ') || 'No skills prerequisite listed'],
    ['Required schedule', opening.requiredBlocks?.length ? opening.requiredBlocks.map(block => dataset.metadata.scheduleLabels[block]).join(', ') : 'No fixed time block listed'],
    ['Compensation', opening.compensation], ['Commitment', `${opening.minWeeklyHours} hours/week for ${opening.commitmentMonths} months`]);
  if (item.type === 'person') common.push(['Contact', item.title], ['Role', item.role]);
  const application = item.action.kind === 'preview_application';
  return `<h3>Why this matches</h3><ul>${item.reasons.map(reason => `<li>${escapeHtml(reason.replace('Confirmed transferable skills:', 'Matching skills:').replace('Shared interests:', 'Matching interests:'))}</li>`).join('')}</ul>
    ${fieldsMarkup(common)}${application ? `<h3>Your profile</h3>${fieldsMarkup([['Name', student.name], ['Hard skills', student.skills.join(', ') || 'None listed']])}` : ''}
    ${item.type === 'lab' ? `<p>${escapeHtml(lab.description)}</p>` : ''}`;
}
