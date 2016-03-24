import visit from "../visit";

export default function() {
  var leaves = [];
  visit(this, function(node) {
    if (!node.children) {
      leaves.push(node);
    }
  });
  return leaves;
}
