export function listClients(request) {
  return request("/api/clients").then((data) => data.clients ?? []);
}

export function getClient(request, id) {
  return request(`/api/clients/${id}`).then((data) => data.client);
}

export function createClient(request, payload) {
  return request("/api/clients", {
    method: "POST",
    body: payload,
  }).then((data) => data.client);
}

export function updateClient(request, id, payload) {
  return request(`/api/clients/${id}`, {
    method: "PUT",
    body: payload,
  }).then((data) => data.client);
}

export function archiveClient(request, id) {
  return request(`/api/clients/${id}`, {
    method: "DELETE",
  }).then((data) => data.client);
}
