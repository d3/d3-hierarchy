import enclose from "./enclose";

export default function(parent) {
  if (!(circles = parent.children)) return void parent.r = 0;

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
  this.circle = circle;
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
  a = new Node(a);
  b = new Node(b);
  c = new Node(c);
  a.next = b.previous = c;
  c.next = a.previous = b;
  b.next = c.previous = a;
  b = c;

  pack: for (i = 3; i < n; ++i) {
    c = new Node(circles[i]);
    tangent(a.circle, b.circle, c.circle);

    for (j = b.next, sj = 1; j !== b; j = j.next, ++sj) {
      if (intersects(j.circle, c.circle)) {
        for (k = a.previous, sk = 1; k !== j; k = k.previous, ++sk) {
          if (intersects(k.circle, c.circle)) {
            break;
          }
        }
        if (k === j && !--sk) { a = a.next, b = b.next, --i; continue pack; }
        if (sj < sk || (sj === sk && b.circle.r < a.circle.r)) b = j;
        else a = k;
        a.next = b, b.previous = a, --i;
        continue pack;
      }
    }

    c.previous = a, c.next = b;
    a.next = b.previous = c;
    b = c;
  }
}
