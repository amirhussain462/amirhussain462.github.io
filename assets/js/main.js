"use strict";

/* ---------------- SETTINGS ---------------- */

const isAdmin = new URLSearchParams(window.location.search).get("admin") === "true";

const grid = document.getElementById("projectsGrid");
const searchInput = document.getElementById("projectSearch");
const filterChips = document.getElementById("filterChips");
const modal = document.getElementById("projectModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

let activeFilter = "All";

/* ---------------- SAFE HELPERS ---------------- */

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function safeText(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

/* ---------------- PROFILE ---------------- */

function initProfile() {
  setText("profileName", profile.name);
  setText("profileTitle", profile.title);
  setText("profileSubtitle", profile.subtitle);

  setHref("resumeBtn", profile.resume);
  setHref("navCvLink", profile.resume);
  setHref("portfolioBtn", profile.portfolio);
  setHref("resumeContactBtn", profile.resume);

  setHref("emailLink", `mailto:${profile.email}`);
  setHref("whatsappLink", profile.whatsapp);
  setHref("linkedinLink", profile.linkedin);

  renderCertifications();
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function setHref(id, value) {
  const element = document.getElementById(id);
  if (element && value) element.href = value;
}

/* ---------------- CERTIFICATIONS ---------------- */

function renderCertifications() {
  const certGrid = document.getElementById("certificationsGrid");
  if (!certGrid) return;

  certGrid.innerHTML = safeArray(profile.certifications).map(cert => `
    <a href="${cert.file}" target="_blank" class="cert-card reveal-item">
      <span>Certification</span>
      <h3>${cert.title}</h3>
      <p>View Certificate →</p>
    </a>
  `).join("");
}

/* ---------------- FILTERS ---------------- */

const allCategories = [
  "All",
  "Project Execution",
  "Material Handling",
  "Troubleshooting",
  "Reliability",
  "Electrical",
  "Hydraulic",
  "Maintenance",
  "Installation"
];
function renderFilters() {
  if (!filterChips) return;

  filterChips.innerHTML = allCategories.map(category => `
    <button class="chip ${category === activeFilter ? "active" : ""}" data-filter="${category}">
      ${category}
    </button>
  `).join("");
}

/* ---------------- PROJECT CARDS ---------------- */

function renderProjects() {
  if (!grid) return;

  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const filteredProjects = projects.filter(project => {
    const searchText = `
      ${safeText(project.title)}
      ${safeText(project.summary)}
      ${safeArray(project.category).join(" ")}
    `.toLowerCase();

    const matchesSearch = searchText.includes(searchTerm);
    const matchesFilter = activeFilter === "All" || safeArray(project.category).includes(activeFilter);

    return matchesSearch && matchesFilter;
  });

  grid.innerHTML = filteredProjects
  .map((project, index) => createProjectCard(project, index + 1))
  .join("");

  observeRevealItems();
}

function createProjectCard(project, displayNumber) {
  return `
    <article class="project-card reveal-item">
      <div class="project-image-wrap">
        <img
          src="${project.folder}${project.hero}"
          alt="${project.title}"
          class="project-image"
          loading="lazy"
        >
      </div>

      <div class="project-card-content">
        <span class="project-number">Project ${displayNumber}</span>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>

        <div class="project-tags">
          ${safeArray(project.category).slice(0, 4).map(tag => `<span>${tag}</span>`).join("")}
        </div>

        <button
  class="project-btn"
  data-project-id="${project.id}"
  data-display-number="${displayNumber}"
>
  View Case Study
</button>
      </div>
    </article>
  `;
}

/* ---------------- PROJECT MODAL ---------------- */

function openProject(id, displayNumber) {
  const project = projects.find(item => String(item.id) === String(id));
  if (!project || !modal || !modalBody) return;

  const galleryImages = safeArray(project.images);
  const videos = safeArray(project.videos);
  const adminNotes = safeArray(project.adminNotes);

  modalBody.innerHTML = `
    <div class="modal-hero">
  <img
    src="${project.folder}${project.hero}"
    alt="${project.title}"
    style="
      object-fit: ${safeText(project.heroFit, "cover")};
      object-position: ${safeText(project.heroPosition, "center center")};
    "
  >
</div>

    <div class="modal-project-header premium-project-header">
      <span>📁 PROJECT ${String(displayNumber).padStart(2, "0")}</span>
      <h2>${project.title}</h2>

      <div class="modal-header-tags">
        ${safeArray(project.category).map(tag => `<span>${tag}</span>`).join("")}
      </div>

      <p>${project.summary}</p>
    </div>

    ${renderProjectInfoCard(project)}
    ${renderRichProjectSections(project)}
    ${renderGallery(project, galleryImages)}
    ${renderVideos(project, videos)}
    ${renderAdminBox(project, galleryImages, videos, adminNotes)}

    <button class="modal-top-btn" onclick="scrollModalTop()">↑ Back to Top</button>
  `;

  modal.classList.add("show");
  document.body.classList.add("no-scroll");

  scrollModalTop();
}

function renderProjectInfoCard(project) {
  const categories = safeArray(project.category);

  return `
    <section class="modal-section project-info-section">
      <div class="project-info-grid">
        <div>
          <span>Primary Area</span>
          <strong>${categories[0] || "Engineering"}</strong>
        </div>

        <div>
          <span>Focus</span>
          <strong>${categories[1] || "Technical"}</strong>
        </div>

        <div>
          <span>My Contribution</span>
          <strong>${safeText(project.contribution, "Engineering Support")}</strong>
        </div>

        <div>
          <span>Environment</span>
          <strong>${safeText(project.environment, "Project / Operational Site")}</strong>
        </div>
      </div>
    </section>
  `;
}
function renderRichProjectSections(project) {
  const sections = [];

  if (project.overview) {
    sections.push(`
      <section class="modal-section">
        <h3>📋 Project Overview</h3>
        <p>${project.overview}</p>
      </section>
    `);
  }

  if (project.challenge) {
    sections.push(`
      <section class="modal-section">
        <h3>⚠️ Technical Challenge</h3>
        <p>${project.challenge}</p>
      </section>
    `);
  }

  if (project.engineering) {
    sections.push(`
      <section class="modal-section">
        <h3>🧠 Engineering Assessment</h3>
        <p>${project.engineering}</p>
      </section>
    `);
  }

  if (safeArray(project.execution).length) {
    sections.push(`
      <section class="modal-section">
        <h3>🔧 Execution Strategy & Implementation</h3>
        <ul class="modal-list">
          ${project.execution.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </section>
    `);
  }

  if (safeArray(project.responsibilities).length) {
    sections.push(`
      <section class="modal-section">
        <h3>👷 My Responsibilities</h3>
        <ul class="modal-list">
          ${project.responsibilities.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </section>
    `);
  }

  if (safeArray(project.results).length) {
    sections.push(`
      <section class="modal-section">
        <h3>📈 Key Results</h3>
        <ul class="modal-list">
          ${project.results.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </section>
    `);
  }

  if (project.achievement) {
    sections.push(`
      <section class="modal-section">
        <h3>🏆 Engineering Achievement</h3>
        <p>${project.achievement}</p>
      </section>
    `);
  }

  if (safeArray(project.technologies).length) {
    sections.push(`
      <section class="modal-section">
        <h3>⚙️ Technologies & Systems Involved</h3>
        <div class="modal-chip-grid">
          ${project.technologies.map(item => `<span>${item}</span>`).join("")}
        </div>
      </section>
    `);
  }

  if (safeArray(project.skills).length) {
    sections.push(`
      <section class="modal-section">
        <h3>💡 Key Skills Demonstrated</h3>
        <div class="modal-chip-grid">
          ${project.skills.map(item => `<span>${item}</span>`).join("")}
        </div>
      </section>
    `);
  }

  return sections.join("");
}

function renderGallery(project, galleryImages) {
  if (!galleryImages.length) return "";

  return `
    <section class="modal-section">
      <h3>🖼️ Project Gallery</h3>
      <p class="gallery-note">Click any image to enlarge.</p>

      <div class="gallery-grid">
        ${galleryImages.map(image => `
          <button class="gallery-item" data-lightbox-src="${project.folder}${image}">
            <img src="${project.folder}${image}" alt="${project.title}" loading="lazy">
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderVideos(project, videos) {
  if (!videos.length) return "";

  return `
    <section class="modal-section">
      <h3>🎥 Project Video</h3>
      <div class="video-grid">
        ${videos.map(video => `
          <video controls class="project-video">
            <source src="${project.folder}${video}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `).join("")}
      </div>
    </section>
  `;
}

function renderAdminBox(project, galleryImages, videos, adminNotes) {
  if (!isAdmin) return "";

  return `
    <section class="admin-box">
      <h3>Admin Notes</h3>
      <p><strong>Hero Image:</strong> ${project.hero}</p>
      <p><strong>Gallery Images:</strong> ${galleryImages.length}</p>
      <p><strong>Videos:</strong> ${videos.length}</p>

      ${adminNotes.length ? `
        <ul>
          ${adminNotes.map(note => `<li>${note}</li>`).join("")}
        </ul>
      ` : `
        <p>No admin notes added.</p>
      `}
    </section>
  `;
}

function scrollModalTop() {
  const content = modal ? modal.querySelector(".modal-content") : null;
  if (content) content.scrollTo({ top: 0, behavior: "smooth" });
}

function closeProjectModal() {
  if (!modal) return;

  modal.classList.remove("show");
  document.body.classList.remove("no-scroll");
}
/* ---------------- LIGHTBOX ---------------- */

function openImageLightbox(src) {
  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";

  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close image">&times;</button>
    <img src="${src}" alt="Project image">
  `;

  document.body.appendChild(lightbox);

  lightbox.addEventListener("click", event => {
    if (
      event.target === lightbox ||
      event.target.classList.contains("lightbox-close")
    ) {
      lightbox.remove();
    }
  });
}

/* ---------------- NAV ACTIVE STATE ---------------- */

function initActiveNavigation() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-links a[href^='#']");

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      navLinks.forEach(link => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  }, {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}

/* ---------------- REVEAL ANIMATION ---------------- */

function observeRevealItems() {
  const items = document.querySelectorAll(".reveal-item:not(.revealed)");

  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  items.forEach(item => observer.observe(item));
}

/* ---------------- EVENT LISTENERS ---------------- */

document.addEventListener("click", event => {
  const projectButton = event.target.closest("[data-project-id]");
if (projectButton) {
  openProject(
    projectButton.dataset.projectId,
    projectButton.dataset.displayNumber
  );
  return;
}

  const galleryItem = event.target.closest("[data-lightbox-src]");
  if (galleryItem) {
    openImageLightbox(galleryItem.dataset.lightboxSrc);
    return;
  }

  const chip = event.target.closest(".chip");
  if (chip) {
    activeFilter = chip.dataset.filter;
    renderFilters();
    renderProjects();
  }
});

if (closeModal) {
  closeModal.addEventListener("click", closeProjectModal);
}

if (modal) {
  modal.addEventListener("click", event => {
    if (event.target === modal) closeProjectModal();
  });
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeProjectModal();

    const lightbox = document.querySelector(".image-lightbox");
    if (lightbox) lightbox.remove();
  }
});

if (searchInput) {
  searchInput.addEventListener("input", renderProjects);
}

/* ---------------- INIT ---------------- */

initProfile();
renderFilters();
renderProjects();
initActiveNavigation();
observeRevealItems();
