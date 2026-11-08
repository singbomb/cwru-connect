import { loadState, persist, stages, filterApplicants } from './data.mjs';
import { overview, postings, applicantWorkspace, labProfile, messages } from './views.mjs';
import { openEditor, openResume } from './editor.mjs';
import { toast } from './ui.mjs';

const state = loadState();
const main = document.querySelector('#main');
let postFilter = 'All';
const filters = { query: '', post: '', stage: '' };
const renderers = { overview, postings, applicants: applicantWorkspace, lab: labProfile, messages };
function route() {
  const [requested, selected] = location.hash.slice(1).split('/');
  return { page: Object.hasOwn(renderers, requested) ? requested : 'overview', selected };
}
function render() {
  const { page, selected } = route();
  const html = page === 'postings' ? postings(state, postFilter) : page === 'applicants' ? applicantWorkspace(state, filters, selected) : page === 'messages' ? messages(state, selected) : renderers[page](state);
  main.innerHTML = html;
  document.title = `CWRU Connect Recruiting | ${page.charAt(0).toUpperCase() + page.slice(1)}`;
  document.querySelectorAll('nav a').forEach(link => {
    if (link.hash === `#${page}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}
function save(message) {
  toast(persist(state) ? message : 'Updated for this session. Browser storage is unavailable.');
}
function handleClick(event) {
  const filterLink = event.target.closest('[data-post-filter], [data-filter-new]');
  if (filterLink) {
    filters.post = filterLink.dataset.postFilter || '';
    filters.stage = filterLink.hasAttribute('data-filter-new') ? 'New' : '';
    filters.query = '';
    if (route().page === 'applicants') render();
  }
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const { action, id, value } = button.dataset;
  if (action === 'new-post') openEditor();
  if (action === 'edit-post') openEditor(state.postings.find(post => post.id === id));
  if (action === 'close-dialog') button.closest('dialog').close();
  if (action === 'resume') openResume(state.applicants.find(person => person.id === id));
  if (action === 'post-status-filter') { postFilter = value; render(); }
}
function savePosting(form, data) {
  const item = Object.fromEntries(data);
  item.hours = Number(item.hours);
  item.duration = Number(item.duration);
  const existing = state.postings.find(post => post.id === form.dataset.id);
  if (existing) Object.assign(existing, item);
  else state.postings.unshift({ ...item, id: crypto.randomUUID() });
  document.querySelector('#editor').close();
  render();
  save(item.status === 'Open' ? 'Position saved as open.' : `Position saved as ${item.status.toLowerCase()}.`);
}
function saveReply(form, data) {
  let conversation = state.messages.find(item => item.applicant === form.dataset.id);
  if (!conversation) {
    conversation = { applicant: form.dataset.id, entries: [], draft: '' };
    state.messages.unshift(conversation);
  }
  conversation.draft = data.get('reply');
  save('Draft saved. Nothing was sent.');
  render();
}
function handleSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  event.preventDefault();
  const data = new FormData(form);
  if (form.id === 'posting-form') savePosting(form, data);
  if (form.id === 'applicant-filters') { Object.assign(filters, Object.fromEntries(data)); render(); }
  if (form.id === 'notes-form') {
    state.applicants.find(person => person.id === form.dataset.id).notes = data.get('notes');
    save('Private notes saved.');
  }
  if (form.id === 'lab-form') { Object.assign(state.lab, Object.fromEntries(data)); render(); save('Lab profile saved.'); }
  if (form.id === 'reply-form') saveReply(form, data);
}
document.addEventListener('click', handleClick);
document.addEventListener('submit', handleSubmit);
document.addEventListener('change', event => {
  if (event.target.id !== 'candidate-stage' || !stages.includes(event.target.value)) return;
  const person = state.applicants.find(item => item.id === event.target.dataset.id);
  person.stage = event.target.value;
  save('Application stage updated.');
  render();
});
window.addEventListener('hashchange', () => {
  const { page, selected } = route();
  if (page === 'applicants' && selected && !filterApplicants(state, filters).some(person => person.id === selected)) {
    Object.assign(filters, { query: '', post: '', stage: '' });
  }
  render();
  window.scrollTo({ top: 0 });
});
render();
