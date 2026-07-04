export function listProjects(request) {
  return request("/api/projects").then((data) => data.projects ?? []);
}

export function getProject(request, id) {
  return request(`/api/projects/${id}`).then((data) => data.project);
}

export function createProject(request, payload) {
  return request("/api/projects", {
    method: "POST",
    body: payload,
  }).then((data) => data.project);
}

export function updateProject(request, id, payload) {
  return request(`/api/projects/${id}`, {
    method: "PUT",
    body: payload,
  }).then((data) => data.project);
}

export function archiveProject(request, id) {
  return request(`/api/projects/${id}`, {
    method: "DELETE",
  }).then((data) => data.project);
}
