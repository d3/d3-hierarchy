import hierarchyNode from "../node/index";
import hierarchyValue from "../hierarchyValue";
import hierarchySort from "../hierarchySort";
import roundNode from "./round";
import squarify from "./squarify";
import {optional, required, defaultValue, defaultSort} from "../accessors";

export default function() {
  var value = defaultValue,
      sort = defaultSort,
      tile = squarify,
      round = false,
      dx = 1,  dy = 1,
      pix0 = 0, piy0 = 0, pix1 = 0, piy1 = 0,
      pox0 = 0, poy0 = 0, pox1 = 0, poy1 = 0;

  function treemap(data) {
    var root = hierarchyNode(data);
    hierarchyValue(root, value);
    if (sort) hierarchySort(root, sort);
    return position(root);
  }

  function position(root) {
    root.x0 = -pix0;
    root.y0 = -piy0;
    root.x1 = dx + pix1;
    root.y1 = dy + piy1;
    root.eachBefore(positionNode);
    if (round) root.eachBefore(roundNode);
    return root;
  }

  function positionNode(node) {
    var x0 = node.x0 + pix0,
        y0 = node.y0 + piy0,
        x1 = node.x1 - pix1,
        y1 = node.y1 - piy1;
    if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
    if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
    node.x0 = x0;
    node.y0 = y0;
    node.x1 = x1;
    node.y1 = y1;
    if (node.children) {
      x0 += pox0 - pix0;
      y0 += poy0 - piy0;
      x1 -= pox1 - pix1;
      y1 -= poy1 - piy1;
      if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
      if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
      tile(node, x0, y0, x1, y1);
    }
  }

  treemap.update = function(root) {
    hierarchyValue(root, value);
    return position(root);
  };

  treemap.value = function(x) {
    return arguments.length ? (value = required(x), treemap) : value;
  };

  treemap.sort = function(x) {
    return arguments.length ? (sort = optional(x), treemap) : sort;
  };

  treemap.round = function(x) {
    return arguments.length ? (round = !!x, treemap) : round;
  };

  treemap.size = function(x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], treemap) : [dx, dy];
  };

  treemap.tile = function(x) {
    return arguments.length ? (tile = required(x), treemap) : tile;
  };

  treemap.padding = function(x) {
    return arguments.length
        ? treemap.paddingInner(x).paddingOuter(x)
        : treemap.paddingInner();
  };

  treemap.paddingInner = function(x) {
    return arguments.length
        ? ((x.splice
          ? (piy0 = x[0] / 2, pix1 = x[1] / 2, piy1 = x[2] / 2, pix0 = x[3] / 2)
          : piy0 = pix1 = piy1 = pix0 = x / 2), treemap)
        : [piy0 * 2, pix1 * 2, piy1 * 2, pix0 * 2];
  };

  treemap.paddingOuter = function(x) {
    return arguments.length
        ? ((x.splice
          ? (poy0 = +x[0], pox1 = +x[1], poy1 = +x[2], pox0 = +x[3])
          : poy0 = pox1 = poy1 = pox0 = +x), treemap)
        : [poy0, pox1, poy1, pox0];
  };

  return treemap;
}
