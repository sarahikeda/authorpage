// Hydrates the author/narrator profile pages from the API.
// If the API is unreachable, the static markup is left in place so the page
// still renders for stakeholder review.

(function () {
  const api = window.LibrofmApi;

  function slugFromPage() {
    // For the prototype we infer the slug from a data attribute on <body>.
    // In the Rails-rendered app this will come from the URL.
    return document.body.dataset.profileSlug;
  }

  function renderProfile(profile) {
    setText(".author-meta .eyebrow", profile.kind === "narrator" ? "Narrator" : "Author");
    setText(".author-meta h1", profile.name);
    setText(".author-meta .tagline", profile.tagline);
    setText(".author-bio", profile.bio);
    document.title = `${profile.name} — Libro.fm`;

    const photo = document.querySelector(".author-photo");
    if (photo) photo.textContent = initials(profile.name);

    const links = document.querySelector(".author-links");
    if (links && profile.links?.length) {
      links.innerHTML = profile.links
        .map((l) => `<a href="${escapeAttr(l.url)}"><span class="icon">${l.icon || "↗"}</span> ${escapeHtml(l.label)}</a>`)
        .join("");
    }

    const tags = document.querySelector(".tags");
    if (tags && profile.tags?.length) {
      tags.innerHTML = profile.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");
    }

    const pill = document.querySelector(".unclaimed-pill");
    if (pill) pill.style.display = profile.claimed ? "none" : "";
  }

  function renderBooks(books) {
    const grid = document.querySelector(".book-grid");
    const count = document.querySelector(".section-head .count");
    if (!grid) return;
    if (count) count.textContent = `${books.length} title${books.length === 1 ? "" : "s"}`;

    grid.innerHTML = books
      .map(
        (b, i) => `
        <a href="/books/${escapeAttr(b.slug)}" class="book">
          <div class="cover cv-${(i % 8) + 1}"><div><div class="t">${escapeHtml(b.title)}</div><div class="a">${escapeHtml(b.subtitle || "")}</div></div></div>
          <div class="title">${escapeHtml(b.title)}</div>
          <div class="narrator">${escapeHtml(b.byline || "")}</div>
          <div class="price">${escapeHtml(b.duration || "")} · ${escapeHtml(b.price || "")}</div>
        </a>`
      )
      .join("");
  }

  async function init() {
    const slug = slugFromPage();
    if (!slug || !api) return;

    try {
      const [profile, books] = await Promise.all([
        api.getProfile(slug),
        api.getProfileBooks(slug),
      ]);
      renderProfile(profile);
      renderBooks(books.items || books);
    } catch (err) {
      console.warn("[Libro.fm] profile hydration failed, keeping static content:", err);
    }
  }

  function setText(sel, value) {
    if (value == null) return;
    const el = document.querySelector(sel);
    if (el) el.textContent = value;
  }
  function initials(name) {
    return name.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  }
  function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }

  document.addEventListener("DOMContentLoaded", init);
})();
