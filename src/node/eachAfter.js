export default function(callback) {
  var node = this, nodes = [node], next = [], children, i;
  while ((node = nodes.pop()) != null) {
    next.push(node), children = node.children;
    if (children) for (i = children.length - 1; i >= 0; --i) {
      nodes.push(children[i]);
    }
  }
  while ((node = next.pop()) != null) {
    callback(node);
  }
}
