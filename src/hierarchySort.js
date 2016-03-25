export default function(node, compare) {
  node.eachBefore(function(node) {
    if (node.children) {
      node.children.sort(compare);
    }
  });
}
