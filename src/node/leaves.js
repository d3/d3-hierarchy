export default function() {
  var leaves = [];
  this.each(function(node) { if (!node.children) leaves.push(node); });
  return leaves;
}
