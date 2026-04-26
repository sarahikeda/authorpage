// Thin client for the Libro.fm Rails API.
// All methods return parsed JSON or throw an ApiError. Callers decide how to
// degrade — most pages fall back to the static markup if the API is unreachable.

(function (global) {
  class ApiError extends Error {
    constructor(message, { status, body } = {}) {
      super(message);
      this.name = "ApiError";
      this.status = status;
      this.body = body;
    }
  }

  function baseUrl() {
    const cfg = global.LibrofmConfig || {};
    if (!cfg.apiBaseUrl) throw new ApiError("LibrofmConfig.apiBaseUrl is not set");
    return cfg.apiBaseUrl.replace(/\/$/, "");
  }

  async function request(path, { method = "GET", body, query, signal } = {}) {
    let url = baseUrl() + path;
    if (query) {
      const qs = new URLSearchParams(
        Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== "")
      ).toString();
      if (qs) url += "?" + qs;
    }

    let response;
    try {
      response = await fetch(url, {
        method,
        signal,
        headers: {
          Accept: "application/json",
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
      });
    } catch (err) {
      throw new ApiError(`Network error: ${err.message}`, { status: 0 });
    }

    const text = await response.text();
    const parsed = text ? safeJson(text) : null;

    if (!response.ok) {
      throw new ApiError(
        (parsed && parsed.error) || `Request failed: ${response.status}`,
        { status: response.status, body: parsed }
      );
    }
    return parsed;
  }

  function safeJson(text) {
    try { return JSON.parse(text); } catch { return null; }
  }

  const Api = {
    ApiError,

    // Profiles (authors + narrators share a profile resource, distinguished by `kind`).
    getProfile: (slug) => request(`/profiles/${encodeURIComponent(slug)}`),
    getProfileBooks: (slug, { page, perPage } = {}) =>
      request(`/profiles/${encodeURIComponent(slug)}/books`, { query: { page, per_page: perPage } }),

    // Claim flow.
    startClaim: ({ slug, email }) =>
      request(`/profiles/${encodeURIComponent(slug)}/claims`, { method: "POST", body: { email } }),
    verifyClaim: (token) =>
      request(`/claims/${encodeURIComponent(token)}/verify`, { method: "POST" }),
    submitClaim: (token, payload) =>
      request(`/claims/${encodeURIComponent(token)}`, { method: "PATCH", body: payload }),

    // Admin.
    listAdminProfiles: ({ q, type, status, page } = {}) =>
      request(`/admin/profiles`, { query: { q, type, status, page } }),
    getAdminStats: () => request(`/admin/profiles/stats`),
    sendClaimInvite: (slug) =>
      request(`/admin/profiles/${encodeURIComponent(slug)}/claim_invites`, { method: "POST" }),
  };

  global.LibrofmApi = Api;
})(window);
