export default function(parent, x0, y0, x1, y1) {

  // exit if no children
  if (!(parent.children) || parent.children.length === 0) {
    return;
  }

  function calcSum(nodes) {
    var sum = 0,
      i = 0,
      n = nodes.length;

    for ( ; i < n; ++i) {
      sum += nodes[i].value;
    }
    return sum;
  }

  var sum = calcSum(parent.children);

  splitTree(parent.children, sum, x0, y0, x1, y1);


  function splitTree(nodes, sum, x0, y0, x1, y1) {

    var i, n = nodes.length;

    if (n === 0) {
      return;
    }

    if (n === 1) {
      nodes[0].x0 = x0;
      nodes[0].x1 = x1;
      nodes[0].y0 = y0;
      nodes[0].y1 = y1;
      return;
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
      halfSize = 0,
      tmp = 0,
      w1 = 0,
      w2 = 0;

    halfSize = sum / 2;
    for (i = 0; i < n; i++) {
      tmp += nodes[i].value;
      if (Math.abs(halfSize - tmp) > Math.abs(halfSize - w1)) {
        list1 = nodes.slice(0, i);
        break;
      }
      w1 = tmp;
    }

    list2 = nodes.slice(i);
    w2 = sum - w1;

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

    if (list1.length > 0 && w1 > 0) {
      splitTree(list1, w1, r1x0, r1y0, r1x1, r1y1);
    }
    if (list2.length > 0 && w2 > 0 ) {
      splitTree(list2, w2, r2x0, r2y0, r2x1, r2y1);
    }
  }
}