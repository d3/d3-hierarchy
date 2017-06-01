export var slice = Array.prototype.slice;

export function shuffle(array) {
  var m = array.length,
      i0 = 0,
      t,
      i;

  while (m) {
    i = Math.random() * m-- | 0;
    t = array[m + i0];
    array[m + i0] = array[i + i0];
    array[i + i0] = t;
  }

  return array;
}
