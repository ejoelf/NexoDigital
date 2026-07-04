export function listWorks(request) {
  return request("/api/works").then((data) => data.works ?? []);
}

export function getWork(request, id) {
  return request(`/api/works/${id}`).then((data) => data.work);
}

export function createWork(request, payload) {
  return request("/api/works", {
    method: "POST",
    body: payload,
  }).then((data) => data.work);
}

export function updateWork(request, id, payload) {
  return request(`/api/works/${id}`, {
    method: "PUT",
    body: payload,
  }).then((data) => data.work);
}

export function archiveWork(request, id) {
  return request(`/api/works/${id}`, {
    method: "DELETE",
  }).then((data) => data.work);
}
