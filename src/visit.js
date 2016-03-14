export function visitBreadth(node, callback) {
  var current, next = [node], children, depth = -1, i;
  do {
    current = next, next = [], ++depth;
    while ((node = current.pop()) != null) {
      callback(node, depth), children = node.children;
      if (children) for (i = children.length - 1; i >= 0; --i) {
        next.push(children[i]);
      }
    }
  } while (next.length);
}

export function visitBefore(node, callback) {
  var nodes = [node], children, i;
  while ((node = nodes.pop()) != null) {
    callback(node), children = node.children;
    if (children) for (i = children.length - 1; i >= 0; --i) {
      nodes.push(children[i]);
    }
  }
}

export function visitAfter(node, callback) {
  var nodes = [node], next = [], children, i;
  while ((node = nodes.pop()) != null) {
    next.push(node), children = node.children;
    if (children) for (i = children.length - 1; i >= 0; --i) {
      nodes.push(children[i]);
    }
  }
  while ((node = next.pop()) != null) {
    callback(node);
  }
}
