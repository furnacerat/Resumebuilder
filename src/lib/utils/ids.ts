export function uid(): string {
  // Local-only unique id; good enough for browser persistence.
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
