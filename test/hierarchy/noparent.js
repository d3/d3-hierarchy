module.exports = function noparent(node) {
  if (!node) return node;
  var copy = {};
  for (var k in node) {
    if (node.hasOwnProperty(k)) switch (k) {
      case "parent": continue;
      case "children": copy[k] = node.children.map(noparent); break;
      default: copy[k] = node[k]; break;
    }
  }
  return copy;
};
