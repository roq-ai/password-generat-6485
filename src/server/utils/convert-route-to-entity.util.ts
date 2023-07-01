const mapping: Record<string, string> = {
  organizations: 'organization',
  passwords: 'password',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
