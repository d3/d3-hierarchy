export default function(node, callback) {
  var nodes = [node], children, i;
  while ((node = nodes.pop()) != null) {
    callback(node), children = node.children;
    if (children) for (i = children.length - 1; i >= 0; --i) {
      nodes.push(children[i]);
    }
  }
}
