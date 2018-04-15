// Look for numerical inconsistencies between the place() and intersects()
// methods from pack/siblings.js

// The place and intersect functions are not exported, so we duplicate them here
function place(a, b, c) {
  var dx = b.x - a.x,
      dy = b.y - a.y,
      dc = dx * dx + dy * dy;
  if (dc) {
    var scale = Math.sqrt(dc);
    var ar = a.r / scale, br = b.r / scale, cr = c.r / scale;
    var x, y;
     if (a.r > b.r) {
      x = (1 - (ar - br) * (ar + br + 2*cr)) / 2;
      y = Math.sqrt(Math.max(0, (br + cr) * (br + cr) - x * x));
      c.x = b.x - x * dx - y * dy;
      c.y = b.y - x * dy + y * dx;
    } else {
      x = (1 - (br - ar) * (ar + br + 2*cr)) / 2;
      y = Math.sqrt(Math.max(0, (ar + cr) * (ar + cr) - x * x));
      c.x = a.x + x * dx - y * dy;
      c.y = a.y + x * dy + y * dx;
    }
  } else {
    c.x = a.x + a.r + c.r;
    c.y = a.y;
  }

  // This last part is not part of the original function!
  if (intersects(a, c) || intersects(b, c)) {
    console.log(`a = {x: ${a.x}, y: ${a.y}, r: ${a.r}},`);
    console.log(`b = {x: ${b.x}, y: ${b.y}, r: ${b.r}},`);
    console.log(`c = {r: ${c.r}}`);
    console.log();
  }
}

function intersects(a, b) {
  var dr = a.r + b.r - 1e-6, dx = b.x - a.x, dy = b.y - a.y;
  return dr > 0 && dr * dr > dx * dx + dy * dy;
}

// Create n random circles.
// The first two are placed touching on the x-axis; the rest are unplaced
function randomCircles(n) {
  const r = [];
  for (var i = 0; i < n; i++) {
    r.push({ r: Math.random() * (1 << (Math.random() * 30)) });
  }
  r[0].x = -r[1].r, r[1].x = r[0].r, r[0].y = r[1].y = 0;
  return r;
}

function test() {
  for(;;) {
    const [a,b,c,d] = randomCircles(4);
    place(b, a, c);
    place(a, c, d);
  }
}

test();
