export default function*() {
  let node = this, current, next = [node], children;
  do {
    current = next, next = [];
    while (node = current.pop()) {
      yield node;
      if (children = node.children) {
        for (let i = 0; i < children.length; ++i) {
          next.unshift(children[i]);
        }
      }
    }
  } while (next.length);
}
