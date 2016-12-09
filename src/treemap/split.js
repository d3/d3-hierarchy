export default function(parent, x0, y0, x1, y1) {

  parent.x0 = x0;
  parent.x1 = x1;
  parent.y0 = y0;
  parent.y1 = y1;

  // exit if no children
  if (!(parent.children) || parent.children.length === 0) {
    return;
  }

  splitTree(parent.children, x0, y0, x1, y1);

  function splitTree(nodes, x0, y0, x1, y1) {

    var i, n = nodes.length;

    if (n === 0) {
      return;
    }

    if (n === 1) {
      nodes[0].x0 = x0;
      nodes[0].x1 = x1;
      nodes[0].y0 = y0;
      nodes[0].y1 = y1;
      if (nodes[0].children && nodes[0].children.length > 0) {
        splitTree(nodes[0].children, x0, y0, x1, y1);
      } else {
        return;
      }
    }

    var sum, sums = new Array(n + 1);

    for (sums[0] = sum = i = 0; i < n; ++i) {
      sums[i + 1] = sum += nodes[i].value;
    }

    var width = x1 - x0,
      height = y1 - y0;

    var list1 = [],
      list2 = [],
      r1x0 = 0,
      r1x1 = 0,
      r1y0 = 0,
      r1y1 = 0,
      r2x0 = 0,
      r2x1 = 0,
      r2y0 = 0,
      r2y1 = 0,
      halfSize = sum / 2,
      w1 = 0,
      tmp = 0;

    for (i = 0; i < n; i++) {
      tmp += nodes[i].value;
      if (Math.abs(halfSize - tmp) > Math.abs(halfSize - w1)) {
        list1 = nodes.slice(0, i);
        break;
      }
      w1 = tmp;
    }

    list2 = nodes.slice(i);

    if (width > height) {
      r1x0 = x0;
      r1y0 = y0;
      r1x1 = x0 + width * w1 / sum;
      r1y1 = y1;

      r2x0 = r1x1;
      r2y0 = y0;
      r2x1 = x1;
      r2y1 = y1;
    } else {
      r1x0 = x0;
      r1y0 = y0;
      r1x1 = x1;
      r1y1 = y0 + height * w1 / sum;

      r2x0 = x0;
      r2y0 = r1y1;
      r2x1 = x1;
      r2y1 = y1;
    }

    splitTree(list1, r1x0, r1y0, r1x1, r1y1);
    splitTree(list2, r2x0, r2y0, r2x1, r2y1);
  }
}