export default function(x) {
  return typeof x === "object" && "length" in x
    ? x // Array, TypedArray, NodeList, array-like
    : Array.from(x); // Map, Set, iterable, string, or anything else
}

// https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
const a = 1664525;
const c = 1013904223;
const mm = 4294967296; // 2^32

export function shuffle(array) {
  let s = 1;
  let m = array.length,
      t,
      i;

  while (m) {
    s = (a * s + c) % mm;
    i = s / mm * m-- | 0;
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
