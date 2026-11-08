import { escapeHtml } from './render.mjs';

const element = id => document.getElementById(id);
let activeFilters = null;
let availableLabs = [];

function populateSelect(id, values, emptyLabel) {
  element(id).innerHTML = `<option value="">${emptyLabel}</option>` + [...new Set(values)].sort()
    .map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');
}

export function resetLabSearch() {
  activeFilters = null;
  element('lab-search-form').reset();
  populateSelect('lab-department', availableLabs.map(lab => lab.department), 'All departments');
  element('lab-search-form').dataset.searched = 'false';
  element('lab-search-form').closest('.discovery').dataset.labSearched = 'false';
  element('lab-advanced').open = false;
}

export function prepareLabSearch(dataset, onSearch) {
  const labs = dataset.labs.filter(lab => lab.scopeVerified);
  availableLabs = labs;
  const departments = () => {
    const previous = element('lab-department').value;
    const selected = labs.filter(lab => !element('lab-school').value || lab.school === element('lab-school').value);
    populateSelect('lab-department', selected.map(lab => lab.department), 'All departments');
    if (selected.some(lab => lab.department === previous)) element('lab-department').value = previous;
  };
  populateSelect('lab-school', labs.map(lab => lab.school), 'All schools');
  populateSelect('lab-topic', labs.flatMap(lab => lab.topics), 'All research areas');
  departments();
  element('lab-school').addEventListener('change', departments);
  element('lab-search-form').addEventListener('submit', event => {
    event.preventDefault();
    activeFilters = { query: element('lab-query').value.trim(), school: element('lab-school').value,
      department: element('lab-department').value, topic: element('lab-topic').value,
      status: element('lab-status').value, savedOnly: element('lab-saved').checked };
    element('lab-advanced').open = false;
    element('lab-search-form').dataset.searched = 'true';
    element('lab-search-form').closest('.discovery').dataset.labSearched = 'true';
    onSearch();
  });
  element('browse-all-labs').addEventListener('click', () => {
    resetLabSearch(); departments(); element('lab-search-form').requestSubmit();
  });
  element('reset-lab-search').addEventListener('click', () => {
    resetLabSearch(); departments(); onSearch(); element('lab-query').focus();
  });
  resetLabSearch();
}

export function filterLabResults(result, dataset, filters, saved = []) {
  if (!filters) return result;
  const query = filters.query.toLowerCase().trim();
  const labs = result.labs.filter(item => {
    const lab = dataset.labs.find(value => value.id === item.labId);
    const text = [lab.name, lab.school, lab.department, ...lab.topics].join(' ').toLowerCase();
    return (!query || text.includes(query)) && (!filters.school || lab.school === filters.school)
      && (!filters.department || lab.department === filters.department)
      && (!filters.topic || lab.topics.includes(filters.topic))
      && (!filters.status || item.status === filters.status)
      && (!filters.savedOnly || saved.includes(`lab:${item.id}`));
  });
  return { ...result, labs };
}

export function applyLabSearch(result, dataset, feedback) {
  return filterLabResults(result, dataset, activeFilters, feedback.saved);
}
