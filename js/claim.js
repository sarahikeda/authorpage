// Wires the claim form to the API. The token comes from ?token= in the URL —
// the Rails backend issues it after the verify-by-email step.

(function () {
  const api = window.LibrofmApi;

  function tokenFromUrl() {
    return new URLSearchParams(window.location.search).get("token");
  }

  function collectPayload(form) {
    const tags = Array.from(form.querySelectorAll(".checkbox-group input[type=checkbox]"))
      .filter((c) => c.checked)
      .map((c) => c.parentElement.querySelector("strong")?.textContent.trim())
      .filter(Boolean);

    const socialInputs = form.querySelectorAll('label + div input[type="text"]');

    return {
      name: val(form, "#name"),
      tagline: val(form, "#tagline"),
      bio: val(form, "#bio"),
      website: val(form, "#site"),
      social_links: Array.from(socialInputs).map((i) => i.value).filter(Boolean),
      tags,
    };
  }

  function val(form, sel) {
    const el = form.querySelector(sel);
    return el ? el.value.trim() : "";
  }

  async function hydrateFromToken(token) {
    if (!token || !api) return;
    try {
      const profile = await api.verifyClaim(token);
      const form = document.querySelector("form");
      if (!form || !profile) return;
      if (profile.name) form.querySelector("#name").value = profile.name;
      if (profile.tagline) form.querySelector("#tagline").value = profile.tagline;
      if (profile.bio) form.querySelector("#bio").value = profile.bio;
      if (profile.website) form.querySelector("#site").value = profile.website;
    } catch (err) {
      console.warn("[Libro.fm] claim verify failed:", err);
    }
  }

  function attachSubmit() {
    const form = document.querySelector("form");
    if (!form) return;
    const publishBtn = form.querySelector(".btn-primary");
    const draftBtn = form.querySelector(".btn-outline");

    publishBtn?.addEventListener("click", (e) => submit(e, form, { publish: true }));
    draftBtn?.addEventListener("click", (e) => submit(e, form, { publish: false }));
  }

  async function submit(e, form, { publish }) {
    e.preventDefault();
    const token = tokenFromUrl();
    if (!token || !api) {
      // Prototype fallback: just navigate as the static link did.
      if (publish) window.location.href = "index.html";
      return;
    }

    const payload = { ...collectPayload(form), publish };
    try {
      await api.submitClaim(token, payload);
      if (publish) window.location.href = "/";
      else flash("Draft saved.");
    } catch (err) {
      flash(err.message || "Something went wrong.", { error: true });
    }
  }

  function flash(message, { error = false } = {}) {
    let el = document.querySelector(".flash");
    if (!el) {
      el = document.createElement("div");
      el.className = "flash";
      el.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:10px 16px;border-radius:6px;font-size:.9rem;z-index:50;";
      document.body.appendChild(el);
    }
    el.style.background = error ? "#b3261e" : "#1f3f35";
    el.style.color = "#fff";
    el.textContent = message;
    clearTimeout(flash._t);
    flash._t = setTimeout(() => el.remove(), 3000);
  }

  document.addEventListener("DOMContentLoaded", () => {
    hydrateFromToken(tokenFromUrl());
    attachSubmit();
  });
})();
