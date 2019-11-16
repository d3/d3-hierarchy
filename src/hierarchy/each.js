export default function(callback, that) {
  var node = this, current, next = [node], children, i, n, index = -1;
  do {
    current = next.reverse(), next = [];
    while (node = current.pop()) {
      callback.call(that, node, ++index, this);
      if (children = node.children) {
        for (i = 0, n = children.length; i < n; ++i) {
          next.push(children[i]);
        }
      }
    }
  } while (next.length);
  return this;
}
