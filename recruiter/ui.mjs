export const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
export const badge = status => `<span class="badge ${status === 'Open' || status === 'Shortlisted' ? 'positive' : status === 'New' || status === 'Interview' ? 'blue' : ''}">${escape(status)}</span>`;
export const photo = (person, size = '') => `<img class="avatar ${size}" src="/demo/assets/network-person-${Number(person.photo)}.jpg" alt="">`;
export const tags = values => `<div class="tags">${values.map(value => `<span>${escape(value)}</span>`).join('')}</div>`;
export const empty = (title, text) => `<div class="empty"><h3>${escape(title)}</h3><p>${escape(text)}</p></div>`;
export const heading = (title, subtitle, action = '') => `<div class="page-heading"><div><h1>${escape(title)}</h1><p>${escape(subtitle)}</p></div>${action}</div>`;
export const postButton = '<button class="primary" data-action="new-post"><span aria-hidden="true">+</span> Post a position</button>';
export function selectOptions(values, selected) { return values.map(value => `<option${value === selected ? ' selected' : ''}>${escape(value)}</option>`).join(''); }
export function field(label, name, value, type = 'text', extra = '') {
  return `<label>${escape(label)}<input name="${name}" type="${type}" value="${escape(value)}" required ${extra}></label>`;
}
export function textField(label, name, value, rows = 4) {
  return `<label>${escape(label)}<textarea name="${name}" rows="${rows}" required>${escape(value)}</textarea></label>`;
}
export function toast(message) {
  const notice = document.querySelector('#notice');
  notice.textContent = message;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { notice.textContent = ''; }, 4000);
}
