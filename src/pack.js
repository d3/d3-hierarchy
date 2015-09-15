import {default as enclosingCircle} from "./enclosingCircle";
import {default as hierarchy, rebind} from "./hierarchy";
import {visitAfter} from "./visit";

function defaultSort(a, b) {
  return a.value - b.value;
}

function insert(a, b) {
  var c = a._pack_next;
  a._pack_next = b;
  b._pack_prev = a;
  b._pack_next = c;
  c._pack_prev = b;
}

function splice(a, b) {
  a._pack_next = b;
  b._pack_prev = a;
}

function intersects(a, b) {
  var dx = b.x - a.x,
      dy = b.y - a.y,
      dr = a.r + b.r;
  return 0.999 * dr * dr > dx * dx + dy * dy; // relative error within epsilon
}

function packChildren(node) {
  if (!(nodes = node.children) || !(n = nodes.length)) return;

  var nodes,
      a, b, c, i, j, k, n;

  // Create node links.
  nodes.forEach(link);

  // Create first node.
  a = nodes[0];
  a.x = -a.r;
  a.y = 0;

  // Create second node.
  if (n > 1) {
    b = nodes[1];
    b.x = b.r;
    b.y = 0;

    // Create third node and build chain.
    if (n > 2) {
      c = nodes[2];
      place(a, b, c);
      insert(a, c);
      a._pack_prev = c;
      insert(c, b);
      b = a._pack_next;

      // Now iterate through the rest.
      for (i = 3; i < n; i++) {
        place(a, b, c = nodes[i]);

        // Search for the closest intersection.
        var isect = 0, s1 = 1, s2 = 1;
        for (j = b._pack_next; j !== b; j = j._pack_next, s1++) {
          if (intersects(j, c)) {
            isect = 1;
            break;
          }
        }
        if (isect == 1) {
          for (k = a._pack_prev; k !== j._pack_prev; k = k._pack_prev, s2++) {
            if (intersects(k, c)) {
              break;
            }
          }
        }

        // Update node chain.
        if (isect) {
          if (s1 < s2 || (s1 == s2 && b.r < a.r)) splice(a, b = j);
          else splice(a = k, b);
          i--;
        } else {
          insert(a, c);
          b = c;
        }
      }
    }
  }

  // Re-center the circles and compute the encompassing radius.
  var c = enclosingCircle(nodes);
  for (i = 0; i < n; ++i) {
    a = nodes[i];
    a.x -= c.x;
    a.y -= c.y;
  }
  node.r = c.r;

  // Remove node links.
  nodes.forEach(unlink);
}

function link(node) {
  node._pack_next = node._pack_prev = node;
}

function unlink(node) {
  delete node._pack_next;
  delete node._pack_prev;
}

function transform(node, x, y, k) {
  var children = node.children;
  node.x = x += k * node.x;
  node.y = y += k * node.y;
  node.r *= k;
  if (children) {
    var i = -1, n = children.length;
    while (++i < n) transform(children[i], x, y, k);
  }
}

function place(a, b, c) {
  var db = a.r + c.r,
      dx = b.x - a.x,
      dy = b.y - a.y;
  if (db && (dx || dy)) {
    var da = b.r + c.r,
        dc = dx * dx + dy * dy;
    da *= da;
    db *= db;
    var x = 0.5 + (db - da) / (2 * dc),
        y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);
    c.x = a.x + x * dx + y * dy;
    c.y = a.y + x * dy - y * dx;
  } else {
    c.x = a.x + db;
    c.y = a.y;
  }
}

export default function() {
  var layout = hierarchy().sort(defaultSort),
      padding = 0,
      size = [1, 1],
      radius;

  function pack(d, i) {
    var nodes = layout.call(this, d, i),
        root = nodes[0],
        w = size[0],
        h = size[1],
        r = radius == null ? Math.sqrt : typeof radius === "function" ? radius : function() { return radius; };

    // Recursively compute the layout.
    root.x = root.y = 0;
    visitAfter(root, function(d) { d.r = +r(d.value); });
    visitAfter(root, packChildren);

    // When padding, recompute the layout using scaled padding.
    if (padding) {
      var dr = padding * (radius ? 1 : Math.max(2 * root.r / w, 2 * root.r / h)) / 2;
      visitAfter(root, function(d) { d.r += dr; });
      visitAfter(root, packChildren);
      visitAfter(root, function(d) { d.r -= dr; });
    }

    // Translate and scale the layout to fit the requested size.
    transform(root, w / 2, h / 2, radius ? 1 : 1 / Math.max(2 * root.r / w, 2 * root.r / h));

    return nodes;
  }

  pack.size = function(_) {
    if (!arguments.length) return size.slice();
    size = [+_[0], +_[1]];
    return pack;
  };

  pack.radius = function(_) {
    if (!arguments.length) return radius;
    radius = _ == null || typeof _ === "function" ? _ : +_;
    return pack;
  };

  pack.padding = function(_) {
    if (!arguments.length) return padding;
    padding = +_;
    return pack;
  };

  return rebind(pack, layout);
};
