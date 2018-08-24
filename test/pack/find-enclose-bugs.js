/* eslint-disable */

var d3 = Object.assign({}, require("../../"), require("d3-array"), require("d3-random"));

var n = 0,
    m = 1000,
    r = d3.randomLogNormal(10),
    x = d3.randomUniform(0, 100),
    y = x;

while (true) {
  if (!(n % 10)) process.stdout.write(".");
  if (!(n % 1000)) process.stdout.write("\n" + n + " ");
  ++n;
  var circles = new Array(20).fill().map(() => ({r: r(), x: x(), y: y()})), circles2,
      enclose = d3.packEnclose(circles), enclose2;
  if (circles.some(circle => !encloses(enclose, circle))) {
    console.log(JSON.stringify(circles));
  }
  for (var i = 0; i < m; ++i) {
    if (!equals(enclose, enclose2 = d3.packEnclose(circles2 = d3.shuffle(circles.slice())))) {
      console.log(JSON.stringify(enclose));
      console.log(JSON.stringify(enclose2));
      console.log(JSON.stringify(circles));
      console.log(JSON.stringify(circles2));
    }
  }
}

function encloses(a, b) {
  var dr = a.r - b.r + 1e-6, dx = b.x - a.x, dy = b.y - a.y;
  return dr > 0 && dr * dr > dx * dx + dy * dy;
}

function equals(a, b) {
  return Math.abs(a.r - b.r) < 1e-6
      && Math.abs(a.x - b.x) < 1e-6
      && Math.abs(a.y - b.y) < 1e-6;
}
