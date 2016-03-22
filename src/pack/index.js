import hierarchy from "../hierarchy";
import rebind from "../rebind";
import enclose from "./enclose";
import intersects from "./intersects";

export default function() {
  var layout = hierarchy(),
      dx = 1,
      dy = 1,
      padding = 0;

  function pack(data) {
    var nodes = layout(data);
    position(nodes[0]);
    return nodes;
  }

  function position(root) {
    root.x = dx / 2, root.y = dy / 2;
    root.eachAfter(packChildren);
    if (padding > 0) root.eachAfter(padChildren(padding * root.r / Math.min(dx, dy)));
    root.eachBefore(translateChild(Math.min(dx, dy) / (2 * root.r)));
  }

  rebind(pack, layout);

  pack.revalue = function(nodes) {
    layout.revalue(nodes);
    position(nodes[0]);
    return nodes;
  };

  pack.size = function(x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], pack) : [dx, dy];
  };

  pack.padding = function(x) {
    return arguments.length ? (padding = +x, pack) : padding;
  };

  return pack;
}

function packChildren(node) {
  if (node.children) {
    packSiblings(node.children);
    var e = enclose(node.children);
    node.children.forEach(translateNode(-e.x, -e.y));
    node.r = e.r;
  } else {
    node.r = Math.sqrt(node.value);
  }
}

function padChildren(r) {
  var pad = padNode(r), unpad = padNode(-r);
  return function(node) {
    if (node.children) {
      node.children.forEach(pad);
      packChildren(node);
      node.children.forEach(unpad);
      node.r += r;
    }
  };
}

function padNode(r) {
  return function(node) {
    node.r += r;
  };
}

function translateChild(k) {
  return function(node) {
    var parent = node.parent;
    node.r *= k;
    if (parent) {
      node.x = parent.x + k * node.x;
      node.y = parent.y + k * node.y;
    }
  };
}

function translateNode(dx, dy) {
  return function(node) {
    node.x += dx, node.y += dy;
  };
}

function place(A, B, C) {
  var a = A._,
      b = B._,
      c = C._,
      ax = a.x,
      ay = a.y,
      da = b.r + c.r,
      db = a.r + c.r,
      dx = b.x - ax,
      dy = b.y - ay,
      dc = dx * dx + dy * dy;
  if (dc) {
    var x = 0.5 + ((db *= db) - (da *= da)) / (2 * dc),
        y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);
    c.x = ax + x * dx + y * dy;
    c.y = ay + x * dy - y * dx;
  } else {
    c.x = ax + db;
    c.y = ay;
  }
  C.score = c.x * c.x + c.y * c.y;
}

function newNode(circle) {
  return {_: circle, next: null, previous: null, score: NaN};
}

function packSiblings(circles) {
  if (!(n = circles.length)) return;
  circles = circles.map(newNode);

  var a, b, c,
      i, j, k,
      sj, sk,
      n;

  a = circles[0], a.score = a._.r * a._.r, a._.x = a._.r, a._.y = 0;
  if (!(n > 1)) return;

  b = circles[1], b.score = b._.r * b._.r, b._.x = -b._.r, b._.y = 0;
  if (!(n > 2)) return;

  // Initialize the front-chain using the first three circles a, b and c.
  place(b, a, c = circles[2]);
  a.next = c.previous = b;
  b.next = a.previous = c;
  c.next = b.previous = a;

  // Attempt to place each remaining circle…
  pack: for (i = 3; i < n; ++i) {
    place(a, b, c = circles[i]);

    // If there are only three elements in the front-chain…
    if ((k = a.previous) === (j = b.next)) {
      // If the new circle intersects the third circle,
      // rotate the front chain to try the next position.
      if (intersects(j._, c._)) {
        a = b, b = j, --i;
        continue pack;
      }
    }

    // Find the closest intersecting circle on the front-chain, if any.
    else {
      sj = j._.r, sk = k._.r;
      do {
        if (sj <= sk) {
          if (intersects(j._, c._)) {
            b = j, a.next = b, b.previous = a, --i;
            continue pack;
          }
          j = j.next, sj += j._.r;
        } else {
          if (intersects(k._, c._)) {
            a = k, a.next = b, b.previous = a, --i;
            continue pack;
          }
          k = k.previous, sk += k._.r;
        }
      } while (j !== k.next);
    }

    // Success! Insert the new circle c between a and b.
    c.previous = a, c.next = b, a.next = b.previous = b = c;

    // Now recompute the closest circle a to the origin.
    while ((c = c.next) !== b) if (c.score < a.score) a = c, b = a.next;
  }
}
