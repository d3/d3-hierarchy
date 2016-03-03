export default function() {
  return function(links) {
    var i = -1,
        n = links.length,
        link,
        paths = new Array(n);
    while (++i < n) link = links[i], paths[i] = path(link.source, link.end);
    return paths;
  };
}

function path(start, end) {
  var lca = leastCommonAncestor(start, end),
      points = [start];
  while (start !== lca) {
    start = start.parent;
    points.push(start);
  }
  var k = points.length;
  while (end !== lca) {
    points.splice(k, 0, end);
    end = end.parent;
  }
  return points;
}

function ancestors(node) {
  var ancestors = [],
      parent = node.parent;
  while (parent != null) {
    ancestors.push(node);
    node = parent;
    parent = parent.parent;
  }
  ancestors.push(node);
  return ancestors;
}

function leastCommonAncestor(a, b) {
  if (a === b) return a;
  var aNodes = ancestors(a),
      bNodes = ancestors(b),
      c = null;
  a = aNodes.pop();
  b = bNodes.pop();
  while (a === b) {
    c = a;
    a = aNodes.pop();
    b = bNodes.pop();
  }
  return c;
}
