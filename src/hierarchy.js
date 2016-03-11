import {map} from "d3-collection";
import {visitAfter} from "./visit";
import links from "./links";

function defaultId(d, i) {
  return i;
}

function defaultParentId(d) {
  return d.parent;
}

function defaultValue(d) {
  return d.value;
}

function defaultSort(a, b) {
  return b.value - a.value;
}

export function rebind(layout, hierarchy) {

  layout.id = function() {
    var x = hierarchy.id.apply(hierarchy, arguments);
    return x === hierarchy ? layout : x;
  };

  layout.parentId = function() {
    var x = hierarchy.parentId.apply(hierarchy, arguments);
    return x === hierarchy ? layout : x;
  };

  layout.value = function() {
    var x = hierarchy.value.apply(hierarchy, arguments);
    return x === hierarchy ? layout : x;
  };

  layout.sort = function() {
    var x = hierarchy.sort.apply(hierarchy, arguments);
    return x === hierarchy ? layout : x;
  };

  return layout;
};

export default function() {
  var id = defaultId,
      parentId = defaultParentId,
      value = defaultValue,
      sort = defaultSort;

  function hierarchy(data) {
    var i,
        n = data.length,
        d,
        nodeId,
        nodeById = map(),
        nodes = new Array(n);

    // Create the wrapper nodes and compute the value of each node.
    //
    // TODO Previously when we computed the value, we knew the depth of the
    // node. Related: previously the this context of the children and value
    // accessors was the hierarchy function, but that’s bogus because it would
    // be the base hierarchy instance rather than the intended subclass (such as
    // a treemap layout instance). Maybe there’s a way to preserve that context
    // but it doesn’t seem particularly useful. Maybe the this context should be
    // the node? That would make it kind of like selections…
    //
    // TODO Also, we only computed the value for leaf nodes, whereas this is
    // going to invoke the value function for all nodes. So, we’ll need to
    // differentiate between the internal (self) value and the subtree value.
    for (i = 0; i < n; ++i) {
      nodeId = id(d = data[i], i, data) + "";
      if (nodeById.has(nodeId)) throw new Error("duplicate node: " + nodeId);
      nodeById.set(nodeId, nodes[i] = {
        id: nodeId,
        data: d,
        value: +value(d, i, data),
        depth: 0,
        children: null,
        parent: null
      });
    }

    // Connect parent and child.
    //
    // NOTE It might be nice to define the parent by reference rather than by
    // id, but I don’t think that’s feasible: we’d need to go from the input
    // datum to its wrapper node. We could set a reference on the input data,
    // but we want to avoid mutating the input; and, iterating over all the
    // input data to find the corresponding node would be slow.
    //
    // TODO Is there an easy way of implicitly defining internal nodes? For
    // example if you have a set of classes in a package hierarchy, maybe you
    // just have the names of the classes and don’t want to also enumerate the
    // packages that contain them. But I think this would require an accessor
    // that enumerates all the ancestor ids (e.g., "java.lang.Number",
    // "java.lang", "java") for a given datum rather than just the parent id.
    //
    // TODO How do we handle multiple roots? We could create an implicit root?
    // Should we return an array of roots?
    for (i = 0; i < n; ++i) {
      var d = data[i],
          child = nodes[i],
          parentNodeId = parentId(d, i, data) + "",
          parent = nodeById.get(parentNodeId);
      if (!parent) throw new Error("parent not found: " + parentNodeId);
      child.parent = parent;
      if (parent.children) parent.children.push(child);
      else parent.children = [child];
    }

    // Compute child depth.
    //
    // We could do this in the previous pass, but it would require recursively
    // descending into each child which could be quadratic time.
  }

  hierarchy.id = function(x) {
    return arguments.length ? (id = x, hierarchy) : id;
  };

  hierarchy.parentId = function(x) {
    return arguments.length ? (parentId = x, hierarchy) : parentId;
  };

  hierarchy.value = function(x) {
    return arguments.length ? (value = x, hierarchy) : value;
  };

  hierarchy.sort = function(x) {
    return arguments.length ? (sort = x, hierarchy) : sort;
  };

  return hierarchy;
}
