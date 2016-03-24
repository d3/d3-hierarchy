export default function(node, callback) {
  var nodes = [node], next = [], children, i, n;
  while ((node = nodes.pop()) != null) {
    next.push(node), children = node.children;
    if (children) for (i = 0, n = children.length; i < n; ++i) {
      nodes.push(children[i]);
    }
  }
  while ((node = next.pop()) != null) {
    callback(node);
  }
}
