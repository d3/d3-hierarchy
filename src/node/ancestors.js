export default function() {
  var node = this, nodes = [this];
  while (node = node.parent) nodes.push(node);
  return nodes;
}
