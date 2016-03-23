export function defaultValue(d) {
  return d.value;
}

export function defaultSort(a, b) {
  return b.value - a.value;
}

export function optional(f) {
  return f == null ? null : required(f);
}

export function required(f) {
  if (typeof f !== "function") throw new Error;
  return f;
}
