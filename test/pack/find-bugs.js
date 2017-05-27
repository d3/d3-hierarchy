var d3 = Object.assign({}, require("../../"), require("d3-random"));

var n = 0, r = d3.randomLogNormal();

while (true) {
  if (!(n % 100)) process.stdout.write(".");
  if (!(n % 10000)) process.stdout.write("\n" + n + " ");
  ++n;
  var radii = new Array(20).fill().map(r);
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
