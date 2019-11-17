export default function(callback, that) {
  if (typeof callback !== "function") throw new Error("not a function");
  let index = -1;
  for (const node of this) {
    if (callback.call(that, node, ++index, this)) {
      return node;
    }
  }
}
