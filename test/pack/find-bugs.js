var d3 = require("../../");

var n = 0, r = randomNormal();

while (true) {
  if (!(n % 100)) process.stdout.write(".");
  if (!(n % 10000)) process.stdout.write("\n" + n + " ");
  ++n;
  var radii = new Array(20).fill().map(r).map(Math.abs);
  try {
    if (intersectsAny(d3.packSiblings(radii.map(r => ({r: r}))))) {
      throw new Error("overlap");
    }
  } catch (error) {
    process.stdout.write("\n");
    process.stdout.write(JSON.stringify(radii));
    process.stdout.write("\n");
    throw error;
  }
}

function randomNormal(mu, sigma) {
  var x, r;
  mu = mu == null ? 0 : +mu;
  sigma = sigma == null ? 1 : +sigma;
  return function() {
    var y;

    // If available, use the second previously-generated uniform random.
    if (x != null) y = x, x = null;

    // Otherwise, generate a new x and y.
    else do {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      r = x * x + y * y;
    } while (!r || r > 1);

    return mu + sigma * y * Math.sqrt(-2 * Math.log(r) / r);
  };
}

function intersectsAny(circles) {
  for (var i = 0, n = circles.length; i < n; ++i) {
    for (var j = i + 1, ci = circles[i], cj; j < n; ++j) {
      if (intersects(ci, cj = circles[j])) {
        return true;
      }
    }
  }
  return false;
}

function intersects(a, b) {
  var dx = b.x - a.x,
      dy = b.y - a.y,
      dr = a.r + b.r;
  return dr * dr - 1e-6 > dx * dx + dy * dy;
}
