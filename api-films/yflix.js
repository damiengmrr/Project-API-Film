const API_BASE = ""; 

const rowsEl = document.getElementById("rows");
const heroEl = document.getElementById("hero");

const swipeEl = document.getElementById("swipe");
const viewGrid = document.getElementById("viewGrid");
const viewSwipe = document.getElementById("viewSwipe");

const btnGrid = document.getElementById("btnGrid");
const btnSwipe = document.getElementById("btnSwipe");

const searchInput = document.getElementById("searchInput");
const btnClearSearch = document.getElementById("btnClearSearch");

const btnFavorites = document.getElementById("btnFavorites");
const drawer = document.getElementById("drawer");
const btnCloseDrawer = document.getElementById("btnCloseDrawer");
const favoritesList = document.getElementById("favoritesList");

const toast = document.getElementById("toast");

const modal = document.getElementById("modal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalContent = document.getElementById("modalContent");

const CATEGORIES = [
  { key: "popular",     title: "Tendances sur YFLIX", hint: "populaires" },
  { key: "top_rated",   title: "Mieux notés",         hint: "top rated" },
  { key: "upcoming",    title: "À venir",             hint: "upcoming" },
  { key: "now_playing", title: "Au cinéma",           hint: "now playing" },
];

let cacheByType = {}; 
let allMovies = [];
let lastHero = null;

function showToast(text){
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1400);
}

function escapeHtml(s){
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function posterUrl(path){
  if (!path) return "";
  return "https://image.tmdb.org/t/p/w500" + path;
}

function backdropUrl(path){
  if (!path) return "";
  return "https://image.tmdb.org/t/p/w780" + path;
}

function tmdbPageUrl(id){
  return `https://www.themoviedb.org/movie/${id}?language=fr-FR`;
}

async function fetchMovies(type){
  const res = await fetch(`${API_BASE}/movies?type=${encodeURIComponent(type)}`);
  return res.json();
}

async function addFavorite(movie){
  const res = await fetch(`${API_BASE}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: movie.id, title: movie.title })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "POST error");
  return data;
}

async function loadFavorites(){
  const res = await fetch(`${API_BASE}/favorites`);
  return res.json();
}

function openDrawer(){
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
}
function closeDrawer(){
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}

/* Modal */
function openModal(movie){
  const bg = backdropUrl(movie.backdrop_path) || posterUrl(movie.poster_path);
  modalContent.innerHTML = `
    <div class="modal__hero" style="background-image:url('${bg}')"></div>
    <div class="modal__body">
      <h3 class="modal__title">${escapeHtml(movie.title)}</h3>
      <p class="modal__desc">${escapeHtml(movie.overview || "Pas de description")}</p>
      <div class="modal__btns">
        <button class="btn" id="modalPlay">▶ Ouvrir TMDB</button>
        <button class="btn" id="modalFav">❤ Favori</button>
      </div>
      <div class="modal__small">
        Date : ${escapeHtml(movie.release_date || "-")} • Note : ${escapeHtml(String(movie.vote_average ?? "-"))}
      </div>
    </div>
  `;
  document.getElementById("modalPlay").onclick = () => window.open(tmdbPageUrl(movie.id), "_blank", "noopener");
  document.getElementById("modalFav").onclick = async () => {
    try { await addFavorite(movie); showToast("favori ajouté"); }
    catch { showToast("erreur favori"); }
  };

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

modalBackdrop.addEventListener("click", closeModal);
modalClose.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* Modes */
function setMode(mode){
  const isGrid = mode === "grid";
  viewGrid.classList.toggle("view--active", isGrid);
  viewSwipe.classList.toggle("view--active", !isGrid);
  btnGrid.setAttribute("aria-pressed", String(isGrid));
  btnSwipe.setAttribute("aria-pressed", String(!isGrid));
}

btnGrid.addEventListener("click", () => setMode("grid"));
btnSwipe.addEventListener("click", () => setMode("swipe"));

/* Favorites UI */
btnFavorites.addEventListener("click", async () => {
  openDrawer();
  favoritesList.innerHTML = "loading...";
  try{
    const favs = await loadFavorites();
    if (!Array.isArray(favs) || favs.length === 0){
      favoritesList.innerHTML = `<div class="favItem">Aucun favori.</div>`;
      return;
    }
    favoritesList.innerHTML = favs.map(f => `
      <div class="favItem">
        <strong>${escapeHtml(f.title)}</strong>
        <a href="${tmdbPageUrl(f.id)}" target="_blank" rel="noopener">ouvrir TMDB</a>
      </div>
    `).join("");
  }catch{
    favoritesList.innerHTML = `<div class="favItem">erreur favoris</div>`;
  }
});

btnCloseDrawer.addEventListener("click", closeDrawer);

/* Hero */
function renderHero(movies){
  if (!movies.length){
    heroEl.innerHTML = "";
    return;
  }
  const m = movies[Math.floor(Math.random() * movies.length)];
  lastHero = m;

  const bg = backdropUrl(m.backdrop_path) || posterUrl(m.poster_path);

  heroEl.innerHTML = `
    <div class="hero__bg" style="background-image:url('${bg}')"></div>
    <div class="hero__content">
      <span class="hero__kicker">À la une</span>
      <h2 class="hero__title">${escapeHtml(m.title)}</h2>
      <p class="hero__desc">${escapeHtml((m.overview || "Pas de description").slice(0, 200))}...</p>
      <div class="hero__btns">
        <button class="btn" id="heroPlay">▶ Ouvrir</button>
        <button class="btn" id="heroMore">ℹ Détails</button>
        <button class="btn" id="heroFav">❤ Favori</button>
      </div>
      <div class="hero__meta">Type: popular • Date: ${escapeHtml(m.release_date || "-")} • Note: ${escapeHtml(String(m.vote_average ?? "-"))}</div>
    </div>
  `;

  document.getElementById("heroPlay").onclick = () => window.open(tmdbPageUrl(m.id), "_blank", "noopener");
  document.getElementById("heroMore").onclick = () => openModal(m);
  document.getElementById("heroFav").onclick = async () => {
    try { await addFavorite(m); showToast("favori ajouté"); }
    catch { showToast("erreur favori"); }
  };
}

/* Rows rendering */
function renderRow(catKey, title, hint, movies){
  return `
    <section class="row" data-row="${catKey}">
      <div class="row__head">
        <h3 class="row__title">${escapeHtml(title)}</h3>
        <div class="row__hint">${escapeHtml(hint)}</div>
      </div>
      <div class="row__rail">
        ${movies.map(m => `
          <article class="posterCard" data-open="${m.id}">
            <img class="posterImg" src="${posterUrl(m.poster_path)}" alt="${escapeHtml(m.title)}">
            <div class="posterOverlay"></div>
            <div class="posterMeta">
              <div class="posterTitle">${escapeHtml(m.title)}</div>
              <div class="posterBtns">
                <button class="pill red" data-fav="${m.id}">❤</button>
                <button class="pill" data-play="${m.id}">▶</button>
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function bindRowEvents(container, movies){
  container.querySelectorAll("[data-play]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-play");
      window.open(tmdbPageUrl(id), "_blank", "noopener");
    });
  });

  container.querySelectorAll("[data-fav]").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const id = Number(btn.getAttribute("data-fav"));
      const movie = movies.find(x => x.id === id);
      if (!movie) return;
      try { await addFavorite(movie); showToast("favori ajouté"); }
      catch { showToast("erreur favori"); }
    });
  });

  container.querySelectorAll("[data-open]").forEach(card => {
    card.addEventListener("click", () => {
      const id = Number(card.getAttribute("data-open"));
      const movie = movies.find(x => x.id === id);
      if (movie) openModal(movie);
    });
  });
}

/* Swipe */
function renderSwipe(movies){
  swipeEl.innerHTML = movies.map(m => `
    <section class="slide" style="background-image:url('${backdropUrl(m.backdrop_path) || posterUrl(m.poster_path)}')">
      <div class="slide__content">
        <h2 class="slide__title">${escapeHtml(m.title)}</h2>
        <p class="slide__desc">${escapeHtml(m.overview || "pas de description")}</p>
      </div>

      <div class="slide__right">
        <button class="iconBtn red" title="favori" data-fav="${m.id}">❤</button>
        <button class="iconBtn" title="détails" data-more="${m.id}">ℹ</button>
        <button class="iconBtn" title="ouvrir tmdb" data-play="${m.id}">▶</button>
      </div>
    </section>
  `).join("");

  swipeEl.querySelectorAll("[data-play]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-play");
      window.open(tmdbPageUrl(id), "_blank", "noopener");
    });
  });

  swipeEl.querySelectorAll("[data-more]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-more"));
      const movie = movies.find(x => x.id === id);
      if (movie) openModal(movie);
    });
  });

  swipeEl.querySelectorAll("[data-fav]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.getAttribute("data-fav"));
      const movie = movies.find(x => x.id === id);
      if (!movie) return;
      try { await addFavorite(movie); showToast("favori ajouté"); }
      catch { showToast("erreur favori"); }
    });
  });
}

/* Search (client-side, simple) */
function renderSearchResults(query){
  const q = query.trim().toLowerCase();
  if (!q){
    renderNetflixRows();
    return;
  }

  const filtered = allMovies.filter(m => {
    const t = (m.title || "").toLowerCase();
    return t.includes(q);
  });

  rowsEl.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.innerHTML = renderRow("search", `Résultats — "${query}"`, `${filtered.length} film(s)`, filtered);
  rowsEl.appendChild(wrapper.firstElementChild);

  bindRowEvents(rowsEl, filtered);

  const baseForHero = filtered.length ? filtered : (cacheByType.popular || []);
  renderHero(baseForHero);
  renderSwipe(filtered.length ? filtered : baseForHero);
}

btnClearSearch.addEventListener("click", () => {
  searchInput.value = "";
  renderSearchResults("");
});

let searchTimer = null;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => renderSearchResults(searchInput.value), 180);
});

/* Build rows from cached categories */
function renderNetflixRows(){
  rowsEl.innerHTML = "";
  let merged = [];

  for (const c of CATEGORIES){
    const movies = cacheByType[c.key] || [];
    merged = merged.concat(movies);

    const box = document.createElement("div");
    box.innerHTML = renderRow(c.key, c.title, c.hint, movies);
    rowsEl.appendChild(box.firstElementChild);

    bindRowEvents(rowsEl, movies);
  }

  // allMovies = dédoublonné
  const map = new Map();
  for (const m of merged) map.set(m.id, m);
  allMovies = Array.from(map.values());

  // hero + swipe sur populaires (ou fallback)
  const base = cacheByType.popular || allMovies;
  renderHero(base);
  renderSwipe(base);
}

/* Init */
async function init(){
  rowsEl.innerHTML = `<div style="color:rgba(255,255,255,.6);font-weight:800">loading…</div>`;

  // charger catégories en parallèle
  const tasks = CATEGORIES.map(async (c) => {
    const data = await fetchMovies(c.key);
    const movies = Array.isArray(data.results) ? data.results : [];
    cacheByType[c.key] = movies;
  });

  try{
    await Promise.all(tasks);
    renderNetflixRows();
  }catch(e){
    rowsEl.innerHTML = `<div style="color:rgba(255,255,255,.6);font-weight:800">erreur api</div>`;
  }
}

setMode("grid");
init();