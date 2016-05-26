export default function(parent, x0, y0, x1, y1) {
  var nodes = parent.children;
  var sums = [0];
  for (var i = 0; i < nodes.length; i++) {
    sums[i+1] = sums[i] + nodes[i].value;
  }
  partition(nodes, sums, 0, nodes.length, parent.value, x0, y0, x1, y1);
}


function partition(nodes, sums, i, j, value, x0, y0, x1, y1) {
  if (i >= j - 1) {
    nodes = nodes[i];
    nodes.x0 = x0, nodes.y0 = y0;
    nodes.x1 = x1, nodes.y1 = y1;
    return;
  }

  var offset = sums[i];
  var goal = (value / 2) + offset;

  var k = i+1, ub = j-1, mid;
  while(k < ub) {
    mid = (k + ub) >>> 1;
    if (sums[mid] < goal) {
      k = mid+1;
    } else {
      ub = mid;
    }
  }

  var valueLeft = sums[k] - offset;
  var valueRight = value - valueLeft;

  if ((y1 - y0) > (x1 - x0)) {
    var yk = (y0 * valueRight + y1 * valueLeft) / value;
    partition(nodes, sums, i, k, valueLeft, x0, y0, x1, yk);
    partition(nodes, sums, k, j, valueRight, x0, yk, x1, y1);
  } else {
    var xk = (x0 * valueRight + x1 * valueLeft) / value;
    partition(nodes, sums, i, k, valueLeft, x0, y0, xk, y1);
    partition(nodes, sums, k, j, valueRight, xk, y0, x1, y1);
  }
}
