export default function(parent, x0, y0, x1, y1) {
  var nodes = parent.children;
  partition(nodes, 0, nodes.length, parent.value, x0, y0, x1, y1);
}

function partition(nodes, i, j, value, x0, y0, x1, y1) {
  if (i >= j - 1) {
    nodes = nodes[i];
    nodes.x0 = x0, nodes.y0 = y0;
    nodes.x1 = x1, nodes.y1 = y1;
    return;
  }

  var k = i, valueHalf = value / 2, valueLeft = 0;
  do valueLeft += nodes[k].value; while (++k < j - 1 && valueLeft < valueHalf);
  var valueRight = value - valueLeft;

  if ((y1 - y0) > (x1 - x0)) {
    var yk = (y0 * valueRight + y1 * valueLeft) / value;
    partition(nodes, i, k, valueLeft, x0, y0, x1, yk);
    partition(nodes, k, j, valueRight, x0, yk, x1, y1);
  } else {
    var xk = (x0 * valueRight + x1 * valueLeft) / value;
    partition(nodes, i, k, valueLeft, x0, y0, xk, y1);
    partition(nodes, k, j, valueRight, xk, y0, x1, y1);
  }
}
