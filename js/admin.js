// Hydrates the admin profiles dashboard. Falls back to static markup on error.

(function () {
  const api = window.LibrofmApi;

  const STATUS_CLASS = {
    claimed: "status-claimed",
    unclaimed: "status-unclaimed",
    pending: "status-pending",
  };

  function renderStats(stats) {
    const kpis = document.querySelectorAll(".kpis .kpi .value");
    if (!stats || !kpis.length) return;
    setVal(kpis[0], stats.total);
    setVal(kpis[1], stats.claimed);
    setVal(kpis[2], stats.pending);
    setVal(kpis[3], stats.tagged);
  }

  function setVal(el, n) {
    if (el && n != null) el.textContent = Number(n).toLocaleString();
  }

  function renderRows(rows) {
    const tbody = document.querySelector("table.profiles tbody");
    if (!tbody) return;
    tbody.innerHTML = rows
      .map((p) => {
        const statusClass = STATUS_CLASS[p.status] || "status-unclaimed";
        const tags = (p.tags || []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join(" ") || "—";
        const profileHref = p.kind === "narrator" ? "narrator.html" : "index.html";
        const action = p.status === "claimed"
          ? `<a href="#" class="btn btn-ghost btn-sm">View</a>`
          : `<a href="claim.html" class="btn btn-outline btn-sm" data-action="invite" data-slug="${escapeAttr(p.slug)}">${p.status === "pending" ? "Resend" : "Send claim link"}</a>`;
        return `
          <tr>
            <td>
              <div class="name"><a href="${profileHref}?slug=${escapeAttr(p.slug)}" style="color:inherit;text-decoration:none;">${escapeHtml(p.name)}</a></div>
              <div class="sub">${escapeHtml(p.publisher || "Independent")}</div>
            </td>
            <td>${p.kind === "narrator" ? "Narrator" : "Author"}</td>
            <td>${p.title_count ?? 0}</td>
            <td><span class="status ${statusClass}">${capitalize(p.status)}</span></td>
            <td>${tags}</td>
            <td>${escapeHtml(p.last_activity || "—")}</td>
            <td>${action}</td>
          </tr>`;
      })
      .join("");
  }

  function attachToolbar(reload) {
    const search = document.querySelector(".toolbar input[type=search]");
    let timer;
    search?.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(reload, 250);
    });

    document.querySelectorAll(".toolbar .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".toolbar .chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        reload();
      });
    });

    document.addEventListener("click", async (e) => {
      const btn = e.target.closest('[data-action="invite"]');
      if (!btn || !api) return;
      e.preventDefault();
      try {
        await api.sendClaimInvite(btn.dataset.slug);
        btn.textContent = "Sent ✓";
      } catch (err) {
        console.warn("[Libro.fm] invite failed:", err);
      }
    });
  }

  function currentFilters() {
    const q = document.querySelector(".toolbar input[type=search]")?.value.trim() || "";
    const active = document.querySelector(".toolbar .chip.active")?.textContent.trim().toLowerCase();
    let type, status;
    if (active === "authors") type = "author";
    else if (active === "narrators") type = "narrator";
    else if (["claimed", "unclaimed", "pending"].includes(active)) status = active;
    return { q, type, status };
  }

  async function load() {
    if (!api) return;
    try {
      const [stats, page] = await Promise.all([
        api.getAdminStats().catch(() => null),
        api.listAdminProfiles(currentFilters()),
      ]);
      if (stats) renderStats(stats);
      renderRows(page.items || page);
    } catch (err) {
      console.warn("[Libro.fm] admin load failed, keeping static rows:", err);
    }
  }

  function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }
  function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : ""; }

  document.addEventListener("DOMContentLoaded", () => {
    attachToolbar(load);
    load();
  });
})();
