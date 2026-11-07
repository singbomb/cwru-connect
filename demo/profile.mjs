import { escapeHtml } from './render.mjs';

const element = id => document.getElementById(id);
const aboutKey = 'cwru-connect-about-v1';
let currentStudent; let aboutByStudent = {}; let resumeUrl; let resumeVersion = 0;
let databasePromise;

function resumeDatabase() {
  if (!databasePromise) databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open('cwru-connect-documents', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('resumes');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return databasePromise;
}

async function resumeRequest(mode, operation) {
  const database = await resumeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('resumes', mode);
    const request = operation(transaction.objectStore('resumes'));
    transaction.oncomplete = () => resolve(request.result);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function status(id, message, error = false) {
  const target = element(id);
  target.textContent = message;
  target.hidden = !message;
  target.classList.toggle('is-error', error);
}

function showResume(record) {
  if (resumeUrl) URL.revokeObjectURL(resumeUrl);
  resumeUrl = null;
  element('resume-empty').hidden = Boolean(record);
  element('resume-attached').hidden = !record;
  element('resume-upload-label').textContent = record ? 'Replace resume' : 'Add resume';
  element('download-resume').removeAttribute('href');
  if (!record) return;
  element('resume-filename').textContent = record.name;
  element('resume-details').textContent = `${Math.max(1, Math.ceil(record.file.size / 1024))} KB`;
  resumeUrl = URL.createObjectURL(record.file);
  element('download-resume').href = resumeUrl;
  element('download-resume').download = record.name;
}

async function loadResume(studentId) {
  const version = ++resumeVersion;
  showResume(null);
  status('resume-status', '');
  try {
    const record = await resumeRequest('readonly', store => store.get(studentId));
    if (version === resumeVersion) showResume(record);
  } catch {
    if (version === resumeVersion) status('resume-status', 'Resume storage is unavailable in this browser.', true);
  }
}

export function validateResume(file) {
  const types = { pdf: 'application/pdf', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
  const extension = file.name.split('.').pop().toLowerCase();
  if (!Object.hasOwn(types, extension) || (file.type && file.type !== types[extension])) return 'Choose a PDF or DOCX file.';
  if (file.size === 0) return 'This file is empty. Choose another resume.';
  if (file.size > 5 * 1024 * 1024) return 'Choose a resume smaller than 5 MB.';
  return '';
}

async function attachResume(event) {
  const file = event.target.files[0];
  event.target.value = '';
  if (!file) return;
  const error = validateResume(file);
  if (error) { status('resume-status', error, true); return; }
  const studentId = currentStudent.id; const version = ++resumeVersion;
  status('resume-status', 'Saving resume…');
  try {
    const record = { name: file.name, file };
    await resumeRequest('readwrite', store => store.put(record, studentId));
    if (version !== resumeVersion) return;
    showResume(record); status('resume-status', 'Resume saved');
  } catch {
    if (version === resumeVersion) status('resume-status', 'Your resume could not be saved. Please try again.', true);
  }
}

async function removeResume() {
  const studentId = currentStudent.id; const version = ++resumeVersion;
  try {
    await resumeRequest('readwrite', store => store.delete(studentId));
    if (version !== resumeVersion) return;
    showResume(null); status('resume-status', 'Resume removed');
  } catch {
    if (version === resumeVersion) status('resume-status', 'Your resume could not be removed. Please try again.', true);
  }
}

function toggleAbout(editing) {
  element('about-form').hidden = !editing;
  element('account-about').hidden = editing;
  element('edit-about').hidden = editing;
  if (editing) { element('about-input').value = element('account-about').textContent; element('about-input').focus(); }
  else element('edit-about').focus();
}

export function prepareProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem(aboutKey) || '{}');
    if (stored && typeof stored === 'object' && !Array.isArray(stored)) aboutByStudent = stored;
  } catch { aboutByStudent = {}; }
  element('edit-about').addEventListener('click', () => toggleAbout(true));
  element('cancel-about').addEventListener('click', () => toggleAbout(false));
  element('about-form').addEventListener('submit', event => {
    event.preventDefault();
    const about = element('about-input').value.trim();
    if (!about) { element('about-input').setCustomValidity('Add a short introduction.'); element('about-input').reportValidity(); return; }
    aboutByStudent[currentStudent.id] = about;
    element('account-about').textContent = about;
    toggleAbout(false);
    try { localStorage.setItem(aboutKey, JSON.stringify(aboutByStudent)); status('about-status', 'About updated'); }
    catch { status('about-status', 'About updated for this visit'); }
  });
  element('about-input').addEventListener('input', () => element('about-input').setCustomValidity(''));
  element('resume-input').addEventListener('change', attachResume);
  element('remove-resume').addEventListener('click', removeResume);
}

export function renderProfile(student) {
  element('account-name').textContent = student.name;
  element('account-headline').textContent = student.label;
  element('account-education').textContent = `Undergraduate student · Year ${student.year}`;
  element('account-hours').textContent = `${student.maxWeeklyHours} hours per week`;
  element('account-commitment').textContent = `${student.commitmentMonths} months`;
  const tags = values => values.map(value => `<li>${escapeHtml(value)}</li>`).join('');
  element('account-skills').innerHTML = tags(student.skills);
  element('account-interests').innerHTML = tags([...new Set([...student.interests, ...student.learningGoals])]);
  if (currentStudent?.id === student.id) return;
  currentStudent = student;
  const saved = aboutByStudent[student.id];
  element('account-about').textContent = typeof saved === 'string' && saved.trim() ? saved : `Undergraduate at Case Western Reserve University with interests in ${student.interests.join(', ') || 'research across disciplines'}${student.skills.length ? ` and skills in ${student.skills.join(', ')}` : ''}.`;
  element('about-form').hidden = true;
  element('account-about').hidden = false;
  element('edit-about').hidden = false;
  element('about-input').setCustomValidity('');
  status('about-status', '');
  loadResume(student.id);
}
