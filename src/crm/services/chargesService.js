export function listCharges(request) {
  return request("/api/charges").then((data) => data.charges ?? []);
}

export function createCharge(request, payload) {
  return request("/api/charges", {
    method: "POST",
    body: payload,
  }).then((data) => data.charge);
}

export function updateCharge(request, id, payload) {
  return request(`/api/charges/${id}`, {
    method: "PUT",
    body: payload,
  }).then((data) => data.charge);
}

export function cancelCharge(request, id) {
  return request(`/api/charges/${id}`, {
    method: "DELETE",
  }).then((data) => data.charge);
}
