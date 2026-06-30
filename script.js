/* JOE COLLECTION — Property Listings — script.js */
(function () {
  "use strict";

  const STORAGE_KEY = "jc_user_listings_v1";
  let allProperties = [];
  let filtered = [];

  const grid = document.getElementById("listingsGrid");
  const emptyState = document.getElementById("emptyState");
  const resultCount = document.getElementById("resultCount");
  const statCount = document.getElementById("statCount");

  /* ---------- Utility ---------- */
  function formatTHB(num) {
    if (!num) return "Price on Request";
    return "THB " + Number(num).toLocaleString("en-US");
  }

  function getUserListings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveUserListing(listing) {
    const current = getUserListings();
    current.unshift(listing);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }

  /* ---------- Load data ---------- */
  async function loadProperties() {
    let base = [];
    try {
      const res = await fetch("data/properties.json");
      base = await res.json();
    } catch (e) {
      console.warn("Could not load data/properties.json — check you are serving via http(s), not file://", e);
    }
    const userAdded = getUserListings();
    allProperties = [...userAdded, ...base];
    filtered = [...allProperties];
    render();
  }

  /* ---------- Card template ---------- */
  function cardHTML(p) {
    const img = p.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop";
    return `
      <article class="card" data-id="${p.id}">
        <div class="card-image">
          <img src="${img}" alt="${p.name}" loading="lazy">
          <span class="card-badge">${p.type || "Property"}</span>
          <span class="card-tenure">${p.tenure || "Freehold"}</span>
        </div>
        <div class="card-body">
          <span class="card-location">${p.location || ""}</span>
          <h3 class="card-title">${p.name}</h3>
          <div class="card-meta">
            <span>🔑 ${p.keys ? p.keys + " Keys" : "—"}</span>
            <span>📐 ${p.land || "—"}</span>
          </div>
          <div class="card-price">${p.priceLabel || formatTHB(p.price)}<small>Asking Price</small></div>
          <div class="card-actions">
            <button class="btn btn-primary view-detail" data-id="${p.id}">Details</button>
            <a class="btn btn-icon" title="Property Website" target="_blank" rel="noopener" href="${p.url || "#"}">🌐</a>
            <a class="btn btn-icon" title="View on Map" target="_blank" rel="noopener" href="${p.map || "#"}">📍</a>
          </div>
        </div>
      </article>`;
  }

  function render() {
    if (!filtered.length) {
      grid.innerHTML = "";
      emptyState.hidden = false;
    } else {
      emptyState.hidden = true;
      grid.innerHTML = filtered.map(cardHTML).join("");
    }
    resultCount.textContent = `${filtered.length} result${filtered.length === 1 ? "" : "s"}`;
    statCount.textContent = allProperties.length;

    grid.querySelectorAll(".view-detail").forEach((btn) => {
      btn.addEventListener("click", () => openModal(btn.dataset.id));
    });
  }

  /* ---------- Filters ---------- */
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const locationFilter = document.getElementById("locationFilter");
  const sortFilter = document.getElementById("sortFilter");

  function applyFilters() {
    const q = searchInput.value.trim().toLowerCase();
    const type = typeFilter.value;
    const loc = locationFilter.value;
    const sort = sortFilter.value;

    filtered = allProperties.filter((p) => {
      const matchesQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.location || "").toLowerCase().includes(q);
      const matchesType = !type || p.type === type;
      const matchesLoc = !loc || p.location === loc;
      return matchesQ && matchesType && matchesLoc;
    });

    if (sort === "price-desc") filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sort === "price-asc") filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "keys-desc") filtered.sort((a, b) => (b.keys || 0) - (a.keys || 0));

    render();
  }

  [searchInput, typeFilter, locationFilter, sortFilter].forEach((el) =>
    el.addEventListener("input", applyFilters)
  );

  /* ---------- Modal ---------- */
  const modal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalClose = document.getElementById("modalClose");

  function openModal(id) {
    const p = allProperties.find((x) => x.id === id);
    if (!p) return;
    modalBody.innerHTML = `
      <div class="modal-body-inner">
        <img class="modal-img" src="${p.image || ""}" alt="${p.name}">
        <div class="modal-content">
          <span class="modal-location">${p.location || ""} · ${p.tenure || "Freehold"}</span>
          <h2 class="modal-title">${p.name}</h2>
          <div class="modal-meta-grid">
            <div class="modal-meta-item"><span class="modal-meta-label">Type</span><span class="modal-meta-value">${p.type || "—"}</span></div>
            <div class="modal-meta-item"><span class="modal-meta-label">Keys / Units</span><span class="modal-meta-value">${p.keys || "—"}</span></div>
            <div class="modal-meta-item"><span class="modal-meta-label">Land Size</span><span class="modal-meta-value">${p.land || "—"}</span></div>
            <div class="modal-meta-item"><span class="modal-meta-label">GFA</span><span class="modal-meta-value">${p.gfa || "—"}</span></div>
          </div>
          <div class="modal-price">${p.priceLabel || formatTHB(p.price)}</div>
          <p class="modal-summary">${p.summary || ""}</p>
          <div class="modal-actions">
            <a class="btn btn-primary btn-block" target="_blank" rel="noopener" href="${p.url || "#"}">View Property Website</a>
            <a class="btn btn-block" style="background:var(--bg-alt);color:var(--primary);border:1px solid var(--line);" target="_blank" rel="noopener" href="${p.map || "#"}">View on Map</a>
            <a class="btn btn-block" style="background:var(--gold);color:var(--primary-dark);" href="mailto:joecollection.m@gmail.com?subject=Inquiry: ${encodeURIComponent(p.name)}">Inquire with Advisor</a>
          </div>
          <div class="modal-advisor">
            <strong>Monthon Mahakijdumrongnukul</strong>
            Deal Maker &amp; Advisor — JOE COLLECTION<br>
            +66 80-657-8387 · joecollection.m@gmail.com
          </div>
        </div>
      </div>`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  modalBackdrop.addEventListener("click", closeModal);
  modalClose.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- Add Listing Form ---------- */
  const form = document.getElementById("listingForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const id = "user-" + Date.now();
    const newListing = {
      id,
      name: fd.get("name"),
      type: fd.get("type"),
      location: fd.get("location"),
      tenure: fd.get("tenure") || "Freehold",
      price: Number(String(fd.get("price")).replace(/[^0-9]/g, "")) || 0,
      priceLabel: "THB " + fd.get("price"),
      keys: fd.get("keys") || "",
      land: fd.get("land") ? fd.get("land") + " Rai" : "",
      gfa: "",
      image: fd.get("image") || "",
      url: fd.get("url") || "#",
      map: fd.get("map") || "#",
      summary: fd.get("summary") || "",
    };
    saveUserListing(newListing);
    allProperties = [newListing, ...allProperties];
    applyFilters();
    form.reset();
    window.scrollTo({ top: document.getElementById("listings").offsetTop - 80, behavior: "smooth" });
  });

  /* ---------- Nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  mainNav.querySelectorAll(".nav-link").forEach((l) =>
    l.addEventListener("click", () => mainNav.classList.remove("open"))
  );

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Anti-copy deterrents ---------- */
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && e.key.toUpperCase() === "U")
    ) {
      e.preventDefault();
    }
  });

  function injectWatermark() {
    const wm = document.createElement("div");
    wm.className = "watermark";
    document.body.appendChild(wm);
    const txt = document.createElement("div");
    txt.className = "wm-text";
    txt.textContent = "JOE COLLECTION";
    document.body.appendChild(txt);
  }
  injectWatermark();

  /* ---------- Init ---------- */
  loadProperties();
})();
