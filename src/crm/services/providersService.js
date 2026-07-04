export function listProviders(request) {
  return request("/api/providers").then((data) => data.providers ?? []);
}

export function getProvider(request, id) {
  return request(`/api/providers/${id}`).then((data) => data.provider);
}

export function createProvider(request, payload) {
  return request("/api/providers", {
    method: "POST",
    body: payload,
  }).then((data) => data.provider);
}

export function updateProvider(request, id, payload) {
  return request(`/api/providers/${id}`, {
    method: "PUT",
    body: payload,
  }).then((data) => data.provider);
}

export function archiveProvider(request, id) {
  return request(`/api/providers/${id}`, {
    method: "DELETE",
  }).then((data) => data.provider);
}
