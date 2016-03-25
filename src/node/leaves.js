import visitBefore from "../visitBefore";

export default function() {
  var leaves = [];
  visitBefore(this, function(node) {
    if (!node.children) {
      leaves.push(node);
    }
  });
  return leaves;
}
