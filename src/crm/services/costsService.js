export function listCosts(request) {
  return request("/api/costs").then((data) => data.costs ?? []);
}

export function getCost(request, id) {
  return request(`/api/costs/${id}`).then((data) => data.cost);
}

export function createCost(request, payload) {
  return request("/api/costs", {
    method: "POST",
    body: payload,
  }).then((data) => data.cost);
}

export function updateCost(request, id, payload) {
  return request(`/api/costs/${id}`, {
    method: "PUT",
    body: payload,
  }).then((data) => data.cost);
}

export function archiveCost(request, id) {
  return request(`/api/costs/${id}`, {
    method: "DELETE",
  }).then((data) => data.cost);
}
