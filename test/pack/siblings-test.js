var tape = require("tape"),
    d3 = require("../../");

tape("packSiblings(circles) produces a non-overlapping layout of circles", function(test) {
  permute([100, 200, 500, 70, 3].map(circleValue), p => intersectsAny(d3.packSiblings(p)) && test.fail(p.map(c => c.r)));
  permute([3, 30, 50, 400, 600].map(circleValue), p => intersectsAny(d3.packSiblings(p)) && test.fail(p.map(c => c.r)));
  permute([1, 1, 3, 30, 50, 400, 600].map(circleValue), p => intersectsAny(d3.packSiblings(p)) && test.fail(p.map(c => c.r)));
  test.equal(intersectsAny(d3.packSiblings([2, 9071, 79, 51, 325, 867, 546, 19773, 371, 16, 165781, 10474, 6928, 40201, 31062, 14213, 8626, 12, 299, 1075, 98918, 4738, 664, 2694, 2619, 51237, 21431, 99, 5920, 1117, 321, 519162, 33559, 234, 4207].map(circleValue))), false);
  test.equal(intersectsAny(d3.packSiblings([0.3371386860049076, 58.65337373332081, 2.118883785686244, 1.7024669121097333, 5.834919697833051, 8.949453403094978, 6.792586534702093, 105.30490014617664, 6.058936212213754, 0.9535722042975694, 313.7636051642043].map(circleRadius))), false);
  test.equal(intersectsAny(d3.packSiblings([6.26551789195159, 1.707773433636342, 9.43220282933871, 9.298909705475646, 5.753163715613753, 8.882383159012575, 0.5819319661882536, 2.0234859171687747, 2.096171518434433, 9.762727931304937].map(circleRadius))), false);
  test.equal(intersectsAny(d3.packSiblings([9.153035316963035, 9.86048622524424, 8.3974499571329, 7.8338007571397865, 8.78260490259886, 6.165829618300345, 7.134819943097564, 7.803701771392344, 5.056638985134191, 7.424601077645588, 8.538658023474753, 2.4616388562274896, 0.5444633747829343, 9.005740508584667].map(circleRadius))), false);
  test.equal(intersectsAny(d3.packSiblings([2.23606797749979, 52.07088264296293, 5.196152422706632, 20.09975124224178, 357.11557267679996, 4.898979485566356, 14.7648230602334, 17.334875731491763].map(circleRadius))), false);
  test.end();
});

function swap(array, i, j) {
  var t = array[i];
  array[i] = array[j];
  array[j] = t;
}

function permute(array, f, n) {
  if (n == null) n = array.length;
  if (n === 1) return void f(array);
  for (var i = 0; i < n - 1; ++i) {
    permute(array, f, n - 1);
    swap(array, n & 1 ? 0 : i, n - 1);
  }
  permute(array, f, n - 1);
}

function circleValue(value) {
  return {r: Math.sqrt(value)};
}

function circleRadius(radius) {
  return {r: radius};
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
