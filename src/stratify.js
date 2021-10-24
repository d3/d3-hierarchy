import {required} from "./accessors.js";
import {Node, computeHeight} from "./hierarchy/index.js";

const preroot = {depth: -1};
const ambiguous = {};
const defaultId = d => d.id;
const defaultParentId = d => d.parentId;

export function stratify(data, {
  id = defaultId,
  parentId = defaultParentId
} = {}) {
  if (typeof id !== "function") throw new Error("invalid id function");
  if (typeof parentId !== "function") throw new Error("invalid parentId function");

  const nodes = Array.from(data);
  const n = nodes.length;
  let root;
  const nodeByKey = new Map;

  for (let i = 0; i < n; ++i) {
    const d = nodes[i];
    const node = nodes[i] = new Node(d);
    let nodeId;
    if ((nodeId = id(d, i, data)) != null && (nodeId = `${nodeId}`)) {
      nodeByKey.set(node.id = nodeId, nodeByKey.has(nodeId) ? ambiguous : node);
    }
    if ((nodeId = parentId(d, i, data)) != null && (nodeId = `${nodeId}`)) {
      node.parent = nodeId;
    }
  }

  for (let i = 0; i < n; ++i) {
    const node = nodes[i];
    const parentId = node.parent;
    if (parentId) {
      const parent = nodeByKey.get(parentId);
      if (!parent) throw new Error(`missing: ${parentId}`);
      if (parent === ambiguous) throw new Error(`ambiguous: ${parentId}`);
      if (parent.children) parent.children.push(node);
      else parent.children = [node];
      node.parent = parent;
    } else {
      if (root) throw new Error("multiple roots");
      root = node;
    }
  }

  if (!root) throw new Error("no root");
  root.parent = preroot;
  let i = 0;
  root.eachBefore((node) => { node.depth = node.parent.depth + 1; ++i; });
  root.eachBefore(computeHeight);
  root.parent = null;
  if (i < n) throw new Error("cycle");

  return root;
}

export default function Stratify() {
  let options = {id: defaultId, parentId: defaultParentId};
  return Object.assign(data => stratify(data, options), {
    id(x) { return arguments.length ? (options.id = required(x), this) : options.id; },
    parentId(x) { return arguments.length ? (options.parentId = required(x), this) : options.parentId; }
  });
}
