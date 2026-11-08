import { prepareNetwork, syncNetwork } from './network.mjs';
import { prepareProfile } from './profile.mjs';
import { prepareNavigation, updateShell, filterResults, focusNavigation } from './navigation.mjs';
import { recommend } from './recommender.mjs';
import { escapeHtml, profileMarkup, resultsMarkup, exclusionsMarkup, previewMarkup, displayTitle } from './render.mjs';
import { replaceFeed, acknowledgeSave, leaveFeed } from './feed-motion.mjs';

const element = id => document.getElementById(id);
const storageKey = 'research-connect-demo-v1';
let dataset; let student; let result; let view = 'home';
let preferences; let feedback; let allFeedback = {}; let previewTrigger;

function emptyFeedback() { return { saved: [], dismissed: [], contacted: [] }; }

function readFeedback() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) allFeedback = saved;
  } catch { element('feedback-note').hidden = false; element('feedback-note').textContent = 'Your changes will be kept for this visit only.'; }
}

function storeFeedback() {
  allFeedback[student.id] = feedback;
  try { localStorage.setItem(storageKey, JSON.stringify(allFeedback)); }
  catch { element('feedback-note').hidden = false; element('feedback-note').textContent = 'Your changes will be kept for this visit only.'; }
}

function loadFeedback() {
  const stored = allFeedback[student.id] || {};
  const validKeys = new Set([...dataset.openings.map(item => `opening:${item.id}`),
    ...dataset.labs.map(item => `lab:${item.id}`), ...dataset.people.map(item => `person:${item.id}`)]);
  feedback = Object.fromEntries(Object.keys(emptyFeedback()).map(key => [key,
    Array.isArray(stored[key]) ? [...new Set(stored[key].filter(value => typeof value === 'string' && validKeys.has(value)))] : []]));
}

function defaultPreferences() {
  return { topics: [...student.interests], maxWeeklyHours: student.maxWeeklyHours,
    scheduleBlocks: [...student.scheduleBlocks], paidOnly: student.preferences.paidOnly, beginnerOnly: false };
}

function checkboxMarkup(values, selected, name, labels = {}) {
  return values.map(value => `<label class="${name === 'topic' ? 'topic-chip' : 'schedule-choice'}"><input type="checkbox" name="${name}" value="${escapeHtml(value)}" ${selected.includes(value) ? 'checked' : ''}><span>${escapeHtml(labels[value] || value)}</span></label>`).join('');
}

function renderControls() {
  element('student').value = student.id;
  element('profile-controls').querySelector('summary').textContent = `Filters · ${student.name}`;
  element('profile-summary').innerHTML = profileMarkup(student);
  element('hours').value = preferences.maxWeeklyHours;
  element('paid').checked = preferences.paidOnly;
  element('beginner').checked = preferences.beginnerOnly;
  element('topic-options').innerHTML = checkboxMarkup(dataset.metadata.topics, preferences.topics, 'topic');
  element('schedule-options').innerHTML = checkboxMarkup(dataset.metadata.scheduleBlocks, preferences.scheduleBlocks, 'schedule', dataset.metadata.scheduleLabels);
  element('filter-error').hidden = true;
  element('hours').removeAttribute('aria-invalid');
}

function renderResults(message = '') {
  try {
    const discoveryOptions = ['labs', 'people'].includes(view) ? { paidOnly: false, beginnerOnly: false } : {};
    result = recommend(dataset, student, { ...preferences, ...discoveryOptions, feedback, saved: feedback.saved, limit: 1000 });
    const visible = filterResults(result, dataset, element('directory-search').value);
    replaceFeed(element('results'), resultsMarkup(visible, dataset, feedback, view, element('saved-only').checked));
    updateShell(student);
    syncNetwork(result, feedback);
    element('exclusions').innerHTML = exclusionsMarkup(result.excluded);
    element('excluded').querySelector('summary').textContent = `${result.excluded.length} positions hidden by your filters`;
    const count = items => element('saved-only').checked ? items.filter(item => feedback.saved.includes(`${item.type}:${item.id}`)).length : items.length;
    const counts = view === 'people' ? `${count(visible.people)} ${count(visible.people) === 1 ? 'person' : 'people'}` : view === 'labs' ? `${count(visible.labs)} labs` : `${count(visible.opportunities)} positions`;
    element('summary').textContent = `${message}${counts}${element('saved-only').checked ? ' · Saved only' : ''}`;
    element('reset-feedback').disabled = !feedback.saved.length && !feedback.dismissed.length && !feedback.contacted.length;
    element('filter-error').hidden = true;
    element('hours').removeAttribute('aria-invalid');
  } catch (error) {
    element('filter-error').textContent = `Preferences could not be applied. ${error.message}. Restore profile preferences to recover.`;
    element('filter-error').hidden = false;
    element('hours').setAttribute('aria-invalid', 'true');
  }
}

function updatePreferences() {
  const hours = element('hours');
  const directoryView = ['labs', 'people'].includes(view);
  const validHours = Boolean(hours.value) && hours.checkValidity();
  if (!directoryView && !validHours) {
    element('filter-error').textContent = 'Enter a whole number from 0 to 40 hours. The results below still use your previous settings.';
    element('filter-error').hidden = false;
    hours.setAttribute('aria-invalid', 'true');
    return;
  }
  preferences = { topics: [...document.querySelectorAll('input[name="topic"]:checked')].map(input => input.value),
    scheduleBlocks: [...document.querySelectorAll('input[name="schedule"]:checked')].map(input => input.value),
    maxWeeklyHours: validHours ? Number(hours.value) : preferences.maxWeeklyHours, paidOnly: element('paid').checked, beginnerOnly: element('beginner').checked };
  element('scenario').value = '';
  element('scenario-note').textContent = 'Custom preferences. Availability limits current openings; paid-only and beginner-only apply to every suggestion.';
  closePreview(false); renderResults();
}

function selectStudent(id) {
  student = dataset.students.find(value => value.id === id);
  preferences = defaultPreferences(); loadFeedback();
  element('scenario').value = ''; element('scenario-note').textContent = '';
  element('saved-only').checked = false;
  closePreview(false); renderControls(); renderResults();
}

function selectScenario(id) {
  const scenario = dataset.scenarios.find(value => value.id === id);
  if (!scenario) { selectStudent(student.id); return; }
  student = dataset.students.find(value => value.id === scenario.studentId);
  preferences = { ...defaultPreferences(), ...scenario.options };
  feedback = emptyFeedback();
  element('saved-only').checked = false;
  element('scenario-note').textContent = `${scenario.description} Feedback is cleared for this scenario; nothing is sent.`;
  closePreview(false); renderControls(); renderResults('Scenario loaded. ');
}

function closePreview(restoreFocus = true) {
  if (element('preview').hidden) return;
  element('preview').hidden = true;
  element('preview-backdrop').hidden = true;
  document.body.classList.remove('drawer-open');
  if (restoreFocus && previewTrigger?.isConnected) previewTrigger.focus();
}

function showPreview(item, trigger) {
  previewTrigger = trigger;
  element('preview-kind').textContent = item.type === 'opening' ? 'Position' : item.type === 'lab' ? 'Lab' : 'Contact';
  element('preview-title').textContent = displayTitle(item);
  element('preview-content').innerHTML = previewMarkup(item, dataset, student);
  element('preview').hidden = false;
  element('preview-backdrop').hidden = false;
  document.body.classList.add('drawer-open');
  element('preview').scrollTop = 0;
  element('preview').focus();
}

async function resultAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const action = button.dataset.action; const key = button.dataset.key;
  if (action === 'restore') { restoreProfile(); focusNavigation(); return; }
  const item = [...result.opportunities, ...result.labs, ...result.people].find(value => `${value.type}:${value.id}` === key);
  if (!item) return;
  if (action === 'preview') { showPreview(item, button); return; }
  if (['dismiss', 'contacted'].includes(action)) {
    const ownerId = student.id;
    const ownerFeedback = feedback;
    button.disabled = true;
    await leaveFeed(button.closest('.result-row'));
    if (student.id !== ownerId || feedback !== ownerFeedback) return;
  }
  if (action === 'save') feedback.saved = feedback.saved.includes(key) ? feedback.saved.filter(value => value !== key) : [...feedback.saved, key];
  else if (['dismiss', 'contacted'].includes(action)) {
    const feedbackType = action === 'dismiss' ? 'dismissed' : 'contacted';
    feedback[feedbackType] = [...new Set([...feedback[feedbackType], key])];
  }
  storeFeedback(); closePreview(false); renderResults(action === 'contacted' ? 'Marked as contacted. ' : 'Preferences updated. ');
  const nextButton = [...element('results').querySelectorAll('button[data-action]')].find(value => value.dataset.key === key && value.dataset.action === action);
  if (nextButton) nextButton.focus(); else focusNavigation();
  if (action === 'save') acknowledgeSave(nextButton);
}

function restoreProfile() {
  preferences = defaultPreferences();
  element('scenario').value = ''; element('scenario-note').textContent = 'Original profile preferences restored. Local feedback is kept until you reset it.';
  closePreview(false); renderControls(); renderResults();
}

function switchView(nextView) {
  view = nextView;
  closePreview(false); renderResults();
}

function bindEvents() {
  element('student').addEventListener('change', event => selectStudent(event.target.value));
  element('scenario').addEventListener('change', event => selectScenario(event.target.value));
  for (const id of ['topic-options', 'schedule-options', 'paid', 'beginner']) element(id).addEventListener('change', updatePreferences);
  element('hours').addEventListener('input', updatePreferences);
  element('directory-search').addEventListener('input', () => { closePreview(false); renderResults(); });
  element('saved-only').addEventListener('change', () => renderResults());
  element('reset-profile').addEventListener('click', restoreProfile);
  element('reset-feedback').addEventListener('click', () => { feedback = emptyFeedback(); storeFeedback(); closePreview(false); renderResults('Saved and hidden items reset. '); });
  element('results').addEventListener('click', resultAction);
  element('close-preview').addEventListener('click', () => closePreview());
  element('preview-backdrop').addEventListener('click', () => closePreview());
  element('preview').addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); closePreview(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...element('preview').querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(node => !node.disabled);
    if (!focusable.length) return;
    const first = focusable[0]; const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === element('preview'))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
}

function prepareResponsiveFilters() {
  const viewport = window.matchMedia('(max-width: 700px)');
  const update = () => { element('profile-controls').open = !viewport.matches; };
  update(); viewport.addEventListener('change', update);
}

async function start() {
  element('load-state').hidden = false; element('load-error').hidden = true;
  try {
    const response = await fetch('/data/simulation/dataset.json');
    if (!response.ok) throw new Error('Fixture request failed');
    dataset = await response.json();
    element('student').innerHTML = dataset.students.map(value => `<option value="${escapeHtml(value.id)}">${escapeHtml(value.name)} — ${escapeHtml(value.label)}</option>`).join('');
    element('scenario').innerHTML = '<option value="">Custom search</option>' + dataset.scenarios.map(value => `<option value="${escapeHtml(value.id)}">${escapeHtml(value.id.replaceAll('-', ' '))}</option>`).join('');
    readFeedback(); prepareProfile(); bindEvents(); prepareNetwork(); prepareResponsiveFilters(); selectStudent(dataset.students[0].id);
    prepareNavigation(switchView);
    element('app').hidden = false; element('load-state').hidden = true;
  } catch {
    element('load-state').hidden = true; element('load-error').hidden = false;
  }
}

element('retry-load').addEventListener('click', () => window.location.reload());
start();
