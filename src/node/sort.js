export default function(compare) {
  this.eachBefore(function(node) {
    if (node.children) {
      node.children.sort(compare);
    }
  });
}
