import visit from "../visit";

export default function() {
  var nodes = [];
  visit(this, function(node) {
    nodes.push(node);
  });
  return nodes;
}
