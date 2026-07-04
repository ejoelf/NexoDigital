export function listSubscriptions(request) {
  return request("/api/subscriptions").then((data) => data.subscriptions ?? []);
}

export function getSubscription(request, id) {
  return request(`/api/subscriptions/${id}`).then((data) => data.subscription);
}

export function createSubscription(request, payload) {
  return request("/api/subscriptions", {
    method: "POST",
    body: payload,
  }).then((data) => data.subscription);
}

export function updateSubscription(request, id, payload) {
  return request(`/api/subscriptions/${id}`, {
    method: "PUT",
    body: payload,
  }).then((data) => data.subscription);
}

export function cancelSubscription(request, id) {
  return request(`/api/subscriptions/${id}`, {
    method: "DELETE",
  }).then((data) => data.subscription);
}
