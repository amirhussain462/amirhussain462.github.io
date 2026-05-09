const DATA_URL = 'data/site.json';

const $ = (s) => document.querySelector(s);

const DEFAULT_PROFILE = {
  name: 'Amir Hussain Shaik',
  title: 'Senior Electrical & Automation Engineer | Project Execution Lead',
  headline: 'Industrial Automation | Material Handling Systems | Project Execution | Site Leadership | Lean Six Sigma Black Belt',
  intro: 'Delivering reliable engineering solutions across Saudi Arabia, UAE and India with 10+ years of experience in electro-mechanical systems, conveyor solutions, automated storage systems and mission-critical maintenance operations.',
  photo: 'assets/images/formal-profile.jpg',
  email: 'amirhussain462@gmail.com',
  phone: 'KSA: +966 56 066 8265 | UAE: +971 54 763 7988',
  phoneDial: '+966560668265',
  linkedin: 'https://www.linkedin.com/in/amirhussainshaik',
  location: 'Riyadh, Saudi Arabia | Dubai, UAE | Available for KSA & UAE Projects'
};

function safeSetText(selector, text) {
  const node = $(selector);
  if (node) node.textContent = text || '';
}

function safeSetHref(selector, href) {
  const node = $(selector);
  if (node) node.href = href || '#';
}

async function loadSite() {
  try {
    const res = await fetch(DATA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('site.json not found');
    const data = await res.json();
    render(data);
  } catch (err) {
    console.warn('Using fallback portfolio data:', err);
    render({});
  }
}

function render(data = {}) {
  const p = { ...DEFAULT_PROFILE, ...(data.profile || {}) };

  document.title = `${p.name} | ${p.title}`;

  safeSetText('#profile-name', p.name);
  safeSetText('#profile-title', p.title);
  safeSetText('#profile-headline', p.headline);
  safeSetText('#profile-intro', p.intro);

  const photo = $('#profile-photo');
  if (photo) photo.src = p.photo || DEFAULT_PROFILE.photo;

  safeSetText('#about-text', data.about || 'Senior Electrical & Automation Engineer with 10+ years of hands-on experience in industrial automation, material handling systems, conveyor systems, airport logistics automation, project execution, maintenance operations, and client-facing technical coordination.');

  renderList('#stats', data.stats || [
    { number: '10+', label: 'Years Experience' },
    { number: '50+', label: 'Major Projects & Deliverables' },
    { number: '98%+', label: 'System Availability Focus' },
    { number: '3', label: 'Countries Experience' }
  ], item => createEl('div', 'stat reveal', `<strong>${item.number}</strong><span>${item.label}</span>`));

  renderList('#expertise-list', data.expertise || [
    { title: 'Industrial Automation', text: 'Automation systems, Siemens PLC S7-300, SCADA WinCC, HMI, VFDs, sensors and control panels.' },
    { title: 'Material Handling Systems', text: 'Conveyors, ASRS, AGVs, EMS, ETVs, sorting systems and airport logistics automation.' },
    { title: 'Project Execution', text: 'Installation, modification, testing, commissioning, snag rectification and client handover.' },
    { title: 'Maintenance Leadership', text: 'Preventive maintenance, corrective maintenance, breakdown response, RCA and uptime improvement.' },
    { title: 'Client & OEM Coordination', text: 'Coordination with clients, OEM specialists, vendors, contractors and airport authorities.' },
    { title: 'Lean Six Sigma', text: 'Certified Lean Six Sigma Black Belt with focus on process improvement and cost optimization.' }
  ], item => createEl('div', 'expertise-card reveal', `<h3>${item.title}</h3><p>${item.text}</p>`));

  renderList('#project-list', data.projects || [], item => createEl('article', 'project-card reveal', `
    <img src="${item.image || 'assets/images/header-bg.jpg'}" alt="${item.title || 'Project'}">
    <div class="project-body">
      <span class="chip">${item.category || 'Project'}</span>
      <h3>${item.title || ''}</h3>
      <p><span class="label">Challenge:</span> ${item.challenge || ''}</p>
      <p><span class="label">Solution:</span> ${item.solution || ''}</p>
      <p><span class="label">Result:</span> ${item.result || ''}</p>
    </div>`));

  renderList('#experience-list', data.experience || [], item => createEl('div', 'timeline-item reveal', `
    <h3>${item.role || ''}</h3>
    <div class="period">${item.company || ''} • ${item.period || ''}</div>
    <p>${item.text || ''}</p>`));

  renderList('#certification-list', data.certifications || [], item => createEl('div', 'cert-card reveal', `
    <img src="${item.image || ''}" alt="${item.title || 'Certificate'}">
    <h3>${item.title || ''}</h3>
    <a href="${item.file || '#'}" target="_blank" rel="noopener">View Certificate</a>`));

  renderList('#gallery-list', data.gallery || [], item => createEl('div', 'gallery-item reveal', `
    <img src="${item.image || ''}" alt="${item.title || 'Gallery Image'}">
    <h3>${item.title || ''}</h3>`));

  safeSetHref('#email-link', `mailto:${DEFAULT_PROFILE.email}`);
  safeSetText('#email-link', DEFAULT_PROFILE.email);

  safeSetHref('#phone-link', `tel:${DEFAULT_PROFILE.phoneDial}`);
  safeSetText('#phone-link', DEFAULT_PROFILE.phone);

  safeSetHref('#linkedin-link', DEFAULT_PROFILE.linkedin);
  safeSetText('#linkedin-link', 'LinkedIn Profile');

  safeSetText('#location-text', DEFAULT_PROFILE.location);

  revealNow();
}

function createEl(tag, cls = '', html = '') {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html) n.innerHTML = html;
  return n;
}

function renderList(selector, list, renderer) {
  const root = $(selector);
  if (!root) return;
  root.innerHTML = '';
  (list || []).forEach(item => root.appendChild(renderer(item)));
}

function revealNow() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(n => n.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.15 });

  items.forEach(n => io.observe(n));
}

const menuBtn = $('.menu-btn');
const navLinks = $('.nav-links');

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
}

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    if (navLinks) navLinks.classList.remove('open');
  });
});

loadSite();
