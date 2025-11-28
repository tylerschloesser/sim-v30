export function invariant(
  condition: unknown,
  message?: string,
): asserts condition {
  if (!condition) {
    debugger;
    throw new Error(message ?? "Invariant violation");
  }
}
