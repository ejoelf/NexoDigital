export function getAlertsSummary(request, days = 30) {
  return request(`/api/alerts/summary?days=${days}`).then(
    (data) => data.summary,
  );
}

export function getUpcomingRenewals(request, days = 30) {
  return request(`/api/alerts/upcoming-renewals?days=${days}`).then(
    (data) => data.renewals,
  );
}

export function getExpiredRenewals(request) {
  return request("/api/alerts/expired-renewals").then(
    (data) => data.renewals,
  );
}

export function getExpiringDomains(request, days = 30) {
  return request(`/api/alerts/expiring-domains?days=${days}`).then(
    (data) => data.domains,
  );
}
