import enclose from "./enclose";

export default function(parent) {
  if (!(circles = parent.children)) return void (parent.r = 0);

  var circles,
      circle = enclose(pack(circles)),
      dx = parent.x - circle.x,
      dy = parent.y - circle.y,
      i = -1,
      n = circles.length;

  parent.r = circle.r;
  while (++i < n) {
    circle = circles[i];
    circle.x += dx;
    circle.y += dy;
  }
}

function tangent(a, b, c) {
  var da = b.r + c.r,
      db = a.r + c.r,
      dx = b.x - a.x,
      dy = b.y - a.y,
      dc = dx * dx + dy * dy;
  if (dc) {
    var x = 0.5 + ((db *= db) - (da *= da)) / (2 * dc),
        y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);
    c.x = a.x + x * dx + y * dy;
    c.y = a.y + x * dy - y * dx;
  } else {
    c.x = a.x + db;
    c.y = a.y;
  }
}

function intersects(a, b) {
  var dx = b.x - a.x,
      dy = b.y - a.y,
      dr = a.r + b.r;
  return 0.999 * dr * dr > dx * dx + dy * dy; // relative error within epsilon
}

function Node(circle) {
  this._ = circle;
}

function pack(circles) {
  if (!(n = circles.length)) return;

  var a, b, c,
      i, j, k,
      sj, sk,
      n;

  a = circles[0], a.x = -a.r, a.y = 0;
  if (!(n > 1)) return;

  b = circles[1], b.x = b.r, b.y = 0;
  if (!(n > 2)) return;

  tangent(a, b, c = circles[2]);
  a = new Node(a), b = new Node(b), c = new Node(c);
  b.next = c.previous = a, c.next = a.previous = b, b = a.next = b.previous = c;

  pack: for (i = 3; i < n; ++i) {
    tangent(a._, b._, (c = new Node(circles[i]))._);

    // Find the first following intersection.
    for (j = b.next, sj = 1; j !== a; j = j.next, ++sj) {
      if (intersects(j._, c._)) {

        // If there are only three elements in the front-chain, rotate it!
        if (a.previous === b.next) {
          a = a.next, b = b.next, --i;
          continue pack;
        }

        // Find the first preceding intersection.
        for (k = a.previous, sk = 0; k !== j; k = k.previous, ++sk) {
          if (intersects(k._, c._)) {
            break;
          }
        }

        // Splice the front-chain using the closer of the two intersections.
        if (sj < sk || (sj === sk && b._.r < a._.r)) b = j; else a = k;
        a.next = b, b.previous = a, --i;
        continue pack;
      }
    }

    c.previous = a, c.next = b, b = a.next = b.previous = c;
  }
}
