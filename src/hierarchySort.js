import visitBefore from "./visitBefore";

export default function(node, compare) {
  visitBefore(node, function(node) {
    if (node.children) {
      node.children.sort(compare);
    }
  });
}
