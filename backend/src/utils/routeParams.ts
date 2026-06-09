export function getRouteParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }
  return value ?? '';
}

export function parseRouteParamId(value: string | string[] | undefined): number {
  return parseInt(getRouteParam(value), 10);
}
