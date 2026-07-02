export function getDashboardOverview(request, days = 30) {
  return request(`/api/dashboard/overview?days=${days}`).then(
    (data) => data.overview,
  );
}

export function getDashboardOperations(request, days = 30) {
  return request(`/api/dashboard/operations?days=${days}`).then(
    (data) => data.operations,
  );
}

export function getDashboardFinancials(request, days = 30) {
  return request(`/api/dashboard/financials?days=${days}`).then(
    (data) => data.financials,
  );
}

export function getDashboardRecentActivity(request) {
  return request("/api/dashboard/recent-activity").then(
    (data) => data.recentActivity,
  );
}
