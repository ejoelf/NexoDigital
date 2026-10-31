export function listTasks(request) {
  return request("/api/tasks").then((data) => data.tasks ?? []);
}

export function createTask(request, payload) {
  return request("/api/tasks", {
    method: "POST",
    body: payload,
  }).then((data) => data.task);
}

export function updateTask(request, id, payload) {
  return request(`/api/tasks/${id}`, {
    method: "PUT",
    body: payload,
  }).then((data) => data.task);
}

export function cancelTask(request, id) {
  return request(`/api/tasks/${id}`, {
    method: "DELETE",
  }).then((data) => data.task);
}
