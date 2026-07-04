export function listDomains(request) {
  return request("/api/domains").then((data) => data.domains ?? []);
}

export function getDomain(request, id) {
  return request(`/api/domains/${id}`).then((data) => data.domain);
}

export function createDomain(request, payload) {
  return request("/api/domains", {
    method: "POST",
    body: payload,
  }).then((data) => data.domain);
}

export function updateDomain(request, id, payload) {
  return request(`/api/domains/${id}`, {
    method: "PUT",
    body: payload,
  }).then((data) => data.domain);
}

export function archiveDomain(request, id) {
  return request(`/api/domains/${id}`, {
    method: "DELETE",
  }).then((data) => data.domain);
}
