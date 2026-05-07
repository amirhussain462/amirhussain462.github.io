const DATA_URL = 'data/site.json';

const $ = (s) => document.querySelector(s);
const el = (tag, cls = '', html = '') => { const n = document.createElement(tag); if (cls) n.className = cls; if (html) n.innerHTML = html; return n; };

async function loadSite(){
  try{
    const res = await fetch(DATA_URL, {cache:'no-store'});
    const data = await res.json();
    render(data);
  }catch(err){
    console.error('Unable to load site data', err);
  }
}

function render(data){
  const p = data.profile || {};
  document.title = `${p.name || 'Amir Hussain Shaik'} | ${p.title || 'Engineering Portfolio'}`;
  $('#profile-name').textContent = p.name || '';
  $('#profile-title').textContent = p.title || '';
  $('#profile-headline').textContent = p.headline || '';
  $('#profile-intro').textContent = p.intro || '';
  $('#profile-photo').src = p.photo || 'assets/images/formal-profile.jpg';
  if(p.heroImage) document.documentElement.style.setProperty('--hero-image', `url('../../${p.heroImage}')`);
  $('#about-text').textContent = data.about || '';

  renderList('#stats', data.stats, item => el('div','stat reveal',`<strong>${item.number}</strong><span>${item.label}</span>`));
  renderList('#expertise-list', data.expertise, item => el('div','expertise-card reveal',`<h3>${item.title}</h3><p>${item.text}</p>`));
  renderList('#project-list', data.projects, item => el('article','project-card reveal',`
    <img src="${item.image}" alt="${item.title}">
    <div class="project-body">
      <span class="chip">${item.category || 'Project'}</span>
      <h3>${item.title}</h3>
      <p><span class="label">Challenge:</span> ${item.challenge}</p>
      <p><span class="label">Solution:</span> ${item.solution}</p>
      <p><span class="label">Result:</span> ${item.result}</p>
    </div>`));
  renderList('#experience-list', data.experience, item => el('div','timeline-item reveal',`<h3>${item.role}</h3><div class="period">${item.company} • ${item.period}</div><p>${item.text}</p>`));
  renderList('#certification-list', data.certifications, item => el('div','cert-card reveal',`<img src="${item.image}" alt="${item.title}"><h3>${item.title}</h3><a href="${item.file}" target="_blank" rel="noopener">View Certificate</a>`));
  renderList('#gallery-list', data.gallery, item => el('div','gallery-item reveal',`<img src="${item.image}" alt="${item.title}"><h3>${item.title}</h3>`));

  if(p.email){ $('#email-link').href = `mailto:${p.email}`; $('#email-link').textContent = p.email; }
  if(p.phone){ $('#phone-link').href = `tel:${p.phone.replace(/[^+0-9]/g,'')}`; $('#phone-link').textContent = p.phone; }
  if(p.linkedin){ $('#linkedin-link').href = p.linkedin; }
  $('#location-text').textContent = p.location || '';
  revealNow();
}

function renderList(selector, list, renderer){
  const root = $(selector); root.innerHTML = '';
  (list || []).forEach(item => root.appendChild(renderer(item)));
}

function revealNow(){
  const io = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }),{threshold:.15});
  document.querySelectorAll('.reveal').forEach(n => io.observe(n));
}

$('.menu-btn').addEventListener('click', () => $('.nav-links').classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => $('.nav-links').classList.remove('open')));
loadSite();
