import { escapeHtml } from './render.mjs';
import { renderProfile } from './profile.mjs';

const element = id => document.getElementById(id);
const pages = {
  home: ['Recommended positions', 'Search positions'],
  jobs: ['Research positions', 'Search by role, lab, or research area'],
  labs: ['Labs', 'Search by lab, department, or research area'],
  network: ['Network', 'Search by name, lab, or research area'],
  messages: ['Messaging', ''],
  profile: ['Your profile', ''],
};

export function focusNavigation() {
  document.querySelector('[data-route][aria-current="page"]')?.focus();
}

export function prepareNavigation(onChange) {
  let initialized = false;
  const apply = () => {
    const hash = window.location.hash.slice(1);
    if (initialized && !Object.hasOwn(pages, hash) && document.getElementById(hash)) return;
    initialized = true;
    const page = Object.hasOwn(pages, hash) ? hash : 'home';
    element('app').dataset.page = page;
    element('home-landing').hidden = page !== 'home';
    element('recommendations').hidden = ['messages', 'profile'].includes(page);
    element('messages-view').hidden = page !== 'messages';
    element('profile-view').hidden = page !== 'profile';
    element('discovery-title').textContent = pages[page][0];
    element('directory-search').placeholder = pages[page][1];
    element('directory-search').setAttribute('aria-label', pages[page][1] || 'Search');
    element('directory-search').value = '';
    element('saved-only').checked = false;
    element('excluded').hidden = !['home', 'jobs'].includes(page);
    for (const link of document.querySelectorAll('[data-route]')) {
      if (link.dataset.route === page) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    onChange(page === 'network' ? 'people' : page);
    if (hash !== 'recommendations') window.scrollTo({ top: 0, behavior: 'instant' });
  };
  window.addEventListener('hashchange', apply);
  prepareHeroSearch();
  apply();
}

function searchJobs(query) {
  const fill = () => {
    const input = element('directory-search');
    input.value = query;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };
  if (window.location.hash === '#jobs') fill();
  else {
    window.addEventListener('hashchange', fill, { once: true });
    window.location.hash = 'jobs';
  }
}

function prepareHeroSearch() {
  element('hero-search').addEventListener('submit', event => {
    event.preventDefault();
    searchJobs(element('hero-query').value.trim());
  });
  element('hero-interests').addEventListener('click', event => {
    const link = event.target.closest('a[data-topic]');
    if (!link) return;
    event.preventDefault();
    searchJobs(link.dataset.topic);
  });
}

export function updateShell(student, result) {
  renderProfile(student);
  element('hero-interests').innerHTML = student.interests.map(topic => `<a href="#jobs" data-topic="${escapeHtml(topic)}">${escapeHtml(topic)}</a>`).join('');
  const opening = result.opportunities[0];
  element('hero-role').textContent = opening?.title.replace(' — ', ' · ') || 'Explore the work happening at Case';
  element('hero-lab').textContent = opening?.labName || 'Find a research direction that interests you';
}

export function filterResults(result, dataset, query) {
  const term = query.trim().toLowerCase();
  if (!term) return result;
  const matches = item => {
    const lab = dataset.labs.find(value => value.id === item.labId);
    return [item.title, item.labName, item.role, lab?.school, lab?.department, ...(lab?.topics || [])]
      .filter(Boolean).join(' ').toLowerCase().includes(term);
  };
  return { ...result, opportunities: result.opportunities.filter(matches),
    labs: result.labs.filter(matches), people: result.people.filter(matches) };
}
