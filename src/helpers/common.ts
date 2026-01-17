export function stl(obj: { [key: string]: string }): string {
  return Object.entries(obj)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");
}
