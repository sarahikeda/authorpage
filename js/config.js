// Runtime config for the API client.
// Override per-environment by setting window.__LIBROFM_CONFIG before this loads,
// or by changing the default below for local development against the Rails app.
window.LibrofmConfig = Object.assign(
  { apiBaseUrl: "http://localhost:3000/api/v1" },
  window.__LIBROFM_CONFIG || {}
);
