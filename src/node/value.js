import visitAfter from "../visitAfter";

export default function(node, value) {
  visitAfter(node, function(node) {
    var sum = +value(node.data) || 0,
        children = node.children,
        i = children && children.length;
    while (--i >= 0) sum += children[i].value;
    node.value = sum;
  });
}
