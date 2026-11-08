import { escape as e, field, textField, selectOptions } from './ui.mjs';

export function openEditor(post) {
  const dialog = document.querySelector('#editor');
  const item = post || { title: '', topic: '', status: 'Draft', hours: 8, duration: 6, pay: 'Paid', deadline: '', skills: '', description: '' };
  dialog.innerHTML = `<form id="posting-form" data-id="${e(post?.id || '')}"><div class="dialog-heading"><div><h2 id="editor-title">${post ? 'Edit position' : 'Post a position'}</h2><p>Give students a clear picture of the opportunity.</p></div><button type="button" class="close" data-action="close-dialog" aria-label="Close posting editor">×</button></div><div class="form-body">${field('Position title', 'title', item.title)}${field('Research area', 'topic', item.topic)}<div class="form-grid"><label>Status<select name="status">${selectOptions(['Draft', 'Open', 'Paused', 'Closed'], item.status)}</select></label><label>Compensation<select name="pay">${selectOptions(['Paid', 'Course credit', 'Unpaid'], item.pay)}</select></label>${field('Hours per week', 'hours', item.hours, 'number', 'min="1" max="40"')}${field('Commitment (months)', 'duration', item.duration, 'number', 'min="1" max="36"')}</div>${field('Application deadline', 'deadline', item.deadline, 'date')}${field('Hard skills', 'skills', item.skills)}${textField('Position description', 'description', item.description, 5)}<div class="form-actions"><button type="button" class="secondary" data-action="close-dialog">Cancel</button><button class="primary">Save position</button></div></div></form>`;
  dialog.showModal();
}
export function openResume(person) {
  const dialog = document.querySelector('#resume');
  dialog.innerHTML = `<div class="dialog-heading"><div><h2 id="resume-title">${e(person.name)}</h2><p>Resume overview</p></div><button class="close" data-action="close-dialog" aria-label="Close resume">×</button></div><article class="resume-body"><p>${e(person.headline)}</p><p>Case Western Reserve University · Cleveland, Ohio</p><section class="detail-section"><h3>Profile</h3><p>${e(person.about)}</p></section><section class="detail-section"><h3>Education</h3><p>Undergraduate studies, Case Western Reserve University</p></section><section class="detail-section"><h3>Project & laboratory experience</h3><p>${e(person.experience)}</p></section><section class="detail-section"><h3>Hard skills</h3><p>${e(person.skills.join(', '))}</p></section><p class="muted resume-note">Fictional candidate summary for this prototype. No resume file was uploaded.</p></article>`;
  dialog.showModal();
}
