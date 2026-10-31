export function getDashboardHome(request, days = 30) {
  return request(`/api/dashboard/home?days=${days}`).then((data) => data.home);
}
