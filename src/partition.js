import {default as hierarchy, rebind} from "./hierarchy";

// TODO use visit function?
function depth(node) {
  var c = node.children, d = 0, i, n;
  if (c) for (i = 0, n = c.length; i < n; ++i) d = Math.max(d, depth(c[i]));
  return 1 + d;
}

// TODO use visit function?
function position(node, x, dx, dy) {
  var children = node.children;
  node.x = x;
  node.y = node.depth * dy;
  node.dx = dx;
  node.dy = dy;
  if (children && (n = children.length)) {
    var i = -1,
        n,
        c,
        d;
    dx = node.value ? dx / node.value : 0;
    while (++i < n) {
      position(c = children[i], x, d = c.value * dx, dy);
      x += d;
    }
  }
}

export default function() {
  var layout = hierarchy(),
      size = [1, 1]; // width, height

  function partition(d, i) {
    var nodes = layout.call(this, d, i);
    position(nodes[0], 0, size[0], size[1] / depth(nodes[0]));
    return nodes;
  }

  partition.size = function(x) {
    if (!arguments.length) return size.slice();
    size = [+x[0], +x[1]];
    return partition;
  };

  return rebind(partition, layout);
};
