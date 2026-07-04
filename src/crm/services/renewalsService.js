export function listRenewals(request) {
  return request("/api/renewals").then((data) => data.renewals ?? []);
}

export function getRenewal(request, id) {
  return request(`/api/renewals/${id}`).then((data) => data.renewal);
}

export function createRenewal(request, payload) {
  return request("/api/renewals", {
    method: "POST",
    body: payload,
  }).then((data) => data.renewal);
}

export function updateRenewal(request, id, payload) {
  return request(`/api/renewals/${id}`, {
    method: "PUT",
    body: payload,
  }).then((data) => data.renewal);
}

export function cancelRenewal(request, id) {
  return request(`/api/renewals/${id}`, {
    method: "DELETE",
  }).then((data) => data.renewal);
}
