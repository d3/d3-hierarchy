export function defaultValue(d) {
  return d.value;
}

export function defaultSort(a, b) {
  return b.value - a.value;
}

export function optional(f) {
  if (f != null && typeof f !== "function") throw new Error;
  return f;
}

export function required(f) {
  if (typeof f !== "function") throw new Error;
  return f;
}
