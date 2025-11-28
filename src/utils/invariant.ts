export function invariant(
  condition: unknown,
  message?: string,
): asserts condition {
  if (!condition) {
    // eslint-disable-next-line no-debugger
    debugger;
    throw new Error(message ?? "Invariant violation");
  }
}
