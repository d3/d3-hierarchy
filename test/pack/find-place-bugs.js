// Look for numerical inconsistencies between the place() and intersects()
// methods from pack/siblings.js

// The place and intersect functions are not exported, so we duplicate them here
function place(a, b, c) {
  var dx = b.x - a.x,
      dy = b.y - a.y,
      dc = dx * dx + dy * dy;
  if (dc) {
    var k = 2 * dc,
        da = a.r * a.r + 2 * a.r * c.r + c.r * c.r,
        db = b.r * b.r + 2 * b.r * c.r + c.r * c.r,
        x = (dc + da - db) / k,
        y = Math.sqrt(Math.max(0, 2 * (db * da + db * dc + da * dc) - db * db - da * da - dc * dc)) / k;
    c.x = a.x + x * dx + y * dy;
    c.y = a.y + x * dy - y * dx;
  } else {
    c.x = a.x + a.r + c.r;
    c.y = a.y;
  }
  if (intersects(a, c) || intersects(b, c)) {
    console.log(`a = {x: ${a.x}, y: ${a.y}, r: ${a.r}},`);
    console.log(`b = {x: ${b.x}, y: ${b.y}, r: ${b.r}},`);
    console.log(`c = {r: ${c.r}}`);
    throw new Error;
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
