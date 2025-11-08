document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("movieGrid");
  const searchInput = document.getElementById("searchInput");
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  const movies = Array.isArray(MOVIES) ? MOVIES.slice() : [];

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);
  }

  function render(list) {
    if (!list.length) {
      grid.innerHTML = '<p class="empty">No movies found.</p>';
      return;
    }
    grid.innerHTML = list.map(m => `
      <a class="card" href="movie.html?id=${encodeURIComponent(m.id)}" title="${escapeHtml(m.title)}">
        <div class="card-img">
          <img src="${m.poster}" alt="${escapeHtml(m.title)} poster" loading="lazy">
          <span class="badge rating">${Number(m.rating).toFixed(1)}★</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(m.title)}</h3>
          <p class="card-meta">${m.year} • ${escapeHtml(m.genres.join(", "))}</p>
        </div>
      </a>
    `).join("");
  }

  function normalize(v) {
    return String(v || "").toLowerCase().trim();
  }

  function applyFilter() {
    const q = normalize(searchInput.value);
    if (!q) return render(movies);
    const filtered = movies.filter(m => {
      const text = `${m.title} ${m.year} ${m.genres.join(" ")} ${m.description}`;
      return normalize(text).includes(q);
    });
    render(filtered);
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilter);
  }

  render(movies);
});