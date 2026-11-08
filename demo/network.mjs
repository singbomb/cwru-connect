const element = id => document.getElementById(id);

export function prepareNetwork() {
  for (const button of document.querySelectorAll('[data-network-view]')) {
    button.addEventListener('click', () => {
      element('saved-only').checked = button.dataset.networkView === 'saved';
      element('saved-only').dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
}

export function syncNetwork(result, feedback) {
  element('network-people-count').textContent = result.people.length;
  element('network-saved-count').textContent = result.people.filter(item => feedback.saved.includes(`person:${item.id}`)).length;
  const selected = element('saved-only').checked ? 'saved' : 'discover';
  for (const button of document.querySelectorAll('[data-network-view]')) {
    button.setAttribute('aria-pressed', String(button.dataset.networkView === selected));
  }
}
