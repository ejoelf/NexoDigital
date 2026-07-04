function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export function listAuditLogs(request, params = {}) {
  return request(`/api/audit-logs${buildQuery(params)}`).then(
    (data) => data.auditLogs ?? [],
  );
}

export function getAuditLog(request, id) {
  return request(`/api/audit-logs/${id}`).then((data) => data.auditLog);
}
