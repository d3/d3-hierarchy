import assert from "assert";
import {packEnclose} from "../../src/index.js";

// https://github.com/d3/d3-hierarchy/issues/188
it("packEnclose(circles) handles a tricky case", () => {
  assert.deepStrictEqual(
    packEnclose([
      {x: 14.5, y: 48.5, r: 7.585},
      {x: 9.5, y: 79.5, r: 2.585},
      {x: 15.5, y: 73.5, r: 8.585}
    ]),
    {
      r: 20.790781637717117,
      x: 12.801935483870967,
      y: 61.59615384615385
    }
  );
});

it('packEnclose(circles) handles large values', () => {
  const circles = [
    { "x": 531214.7271532917, "y": 360738.8204573899, "r": 10 },
    { "x": 531242.0429781883, "y": 360764.87727581244, "r": 10 },
    { "x": 531239.7927335791, "y": 360716.54336245544, "r": 10 }
  ];
  assert.doesNotThrow(() => packEnclose(circles));
});
