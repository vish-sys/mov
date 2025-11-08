document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  const movie = (Array.isArray(MOVIES) ? MOVIES : []).find(m => m.id === id);

  if (!movie) {
    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = `
        <p class="empty">Movie not found. <a href="index.html">Back to Home</a></p>
      `;
    }
    document.title = "Movie Hub";
    return;
  }

  document.title = `${movie.title} • Movie Hub`;

  const posterEl = document.getElementById("poster");
  const titleEl = document.getElementById("title");
  const metaEl = document.getElementById("meta");
  const descEl = document.getElementById("description");
  const hero = document.getElementById("movieHero");
  const playerContainer = document.getElementById("playerContainer");

  posterEl.src = movie.poster;
  posterEl.alt = `${movie.title} poster`;
  titleEl.textContent = movie.title;

  const joinGenres = Array.isArray(movie.genres) ? movie.genres.join(", ") : "";
  metaEl.textContent = `${movie.year} • ${joinGenres} • ${movie.duration} min • ${Number(movie.rating).toFixed(1)}★`;
  descEl.textContent = movie.description;

 if (movie.banner && hero) {
  const bannerUrl = new URL(movie.banner, document.baseURI).href; // absolute URL
  hero.classList.add("has-bg");
  hero.style.background =
    `linear-gradient(180deg, rgba(15,15,20,.3), var(--bg) 70%), url('${bannerUrl}') center/cover no-repeat`;
}

  // Render player (embed or mp4)
  function renderPlayer(m) {
    playerContainer.innerHTML = "";

    const isEmbed = m.type === "embed" || (!!m.embedUrl && !m.video);

    if (isEmbed && m.embedUrl) {
      const iframe = document.createElement("iframe");
      iframe.src = m.embedUrl;
      iframe.title = `${m.title} player`;
      iframe.loading = "lazy";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allowFullscreen = true;
      playerContainer.appendChild(iframe);
    } else if (m.video) {
      const videoEl = document.createElement("video");
      videoEl.controls = true;
      videoEl.preload = "metadata";
      videoEl.poster = m.poster || "";
      const source = document.createElement("source");
      source.src = m.video;
      source.type = "video/mp4";
      videoEl.appendChild(source);
      playerContainer.appendChild(videoEl);
    } else {
      playerContainer.innerHTML = `<p class="empty">No video available.</p>`;
    }
  }

  renderPlayer(movie);
});