# d3-hierarchy

…

## Installing

If you use NPM, `npm install d3-hierarchy`. Otherwise, download the [latest release](https://github.com/d3/d3-hierarchy/releases/latest).

## API Reference

### Hierarchies

Before you can compute a hierarchical layout, you need a hierarchical data structure: a root node. If you already have hierarchical data, such as a JSON file, you can pass it directly to the hierarchical layout. Otherwise, you can arrange tabular input data, such as a comma-separated values (CSV) file, into a hierarchy using [d3.hierarchy](#hierarchy).

<a name="hierarchy" href="#hierarchy">#</a> d3.<b>hierarchy</b>()

For example, consider the following table of relationships:

Name  | Parent
------|--------
Eve   |
Cain  | Eve
Seth  | Eve
Enos  | Seth
Noam  | Seth
Abel  | Eve
Awan  | Eve
Enoch | Awan
Azura | Eve

To represent this hierarchy as a CSV file:

```
id,parentId
Eve,
Cain,Eve
Seth,Eve
Enos,Seth
Noam,Seth
Abel,Eve
Awan,Eve
Enoch,Awan
Azura,Eve
```

To parse the CSV using [d3.csvParse](https://github.com/d3/d3-dsv#csvParse):

```js
var table = d3.csvParse(text);
```

This returns:

```json
[
  {"id": "Eve",   "parentId": ""},
  {"id": "Cain",  "parentId": "Eve"},
  {"id": "Seth",  "parentId": "Eve"},
  {"id": "Enos",  "parentId": "Seth"},
  {"id": "Noam",  "parentId": "Seth"},
  {"id": "Abel",  "parentId": "Eve"},
  {"id": "Awan",  "parentId": "Eve"},
  {"id": "Enoch", "parentId": "Awan"},
  {"id": "Azura", "parentId": "Eve"}
]
```

To convert to a hierarchy:

```js
var root = d3.hierarchy()(table);
```

This returns:

```json
{
  "id": "Eve",
  "children": [
    {
      "id": "Cain"
    },
    {
      "id": "Seth",
      "children": [
        {
          "id": "Enos"
        },
        {
          "id": "Noam"
        }
      ]
    },
    {
      "id": "Abel"
    },
    {
      "id": "Awan",
      "children": [
        {
          "id": "Enoch"
        }
      ]
    },
    {
      "id": "Azura"
    }
  ]
}
```

Each node in the returned object has a shallow copy of the properties from the corresponding data object, excluding the following reserved properties: id, parentId, children.

<a name="_hierarchy" href="#_hierarchy">#</a> <i>hierarchy</i>(<i>data</i>)

…

<a name="hierarchy_id" href="#hierarchy_id">#</a> <i>hierarchy</i>.<b>id</b>([<i>function</i>])

…

<a name="hierarchy_parentId" href="#hierarchy_parentId">#</a> <i>hierarchy</i>.<b>parentId</b>([<i>function</i>])

…

### Hierarchy Nodes

…

<a name="hierarchyNode" href="#hierarchyNode">#</a> d3.<b>hierarchyNode</b>(<i>data</i>)

Constructs a root hierarchy node from the specified hierarchical *data*. The specified *data* must be an object representing the root node, and may have a *data*.children property specifying an array of data representing the children of the root node; each descendant child *data* may also have *data*.children. See [d3.hierarchy](#hierarchy) for an example.

This method is typically not called directly; instead it is used by hierarchical layouts to initialize root nodes.

<a name="node_data" href="#node_data">#</a> <i>node</i>.<b>data</b>

A reference to the data associated with this node, as specified to the [constructor](#hierarchyNode).

<a name="node_parent" href="#node_parent">#</a> <i>node</i>.<b>parent</b>

A reference to the parent node; null for the root node.

<a name="node_children" href="#node_children">#</a> <i>node</i>.<b>children</b>

An array of child nodes, if any; undefined for leaf nodes.

<a name="node_ancestors" href="#node_ancestors">#</a> <i>node</i>.<b>ancestors</b>()

Returns the array of ancestors nodes, starting with this node, then followed by each parent up to the root.

<a name="node_descendants" href="#node_descendants">#</a> <i>node</i>.<b>descendants</b>()

Returns the array of descendant nodes, starting with this node, then followed by each child in topological order.

<a name="node_leaves" href="#node_leaves">#</a> <i>node</i>.<b>leaves</b>()

Returns the array of leaf nodes; a subset of this node’s [descendants](#node_descendants) including only nodes with no children.

### Treemapping

…

<a name="treemap" href="#treemap">#</a> d3.<b>treemap</b>()

…

<a name="_treemap" href="#_treemap">#</a> <i>treemap</i>(<i>root</i>)

…

<a name="treemap_tile" href="#treemap_tile">#</a> <i>treemap</i>.<b>tile</b>([<i>function</i>])

…

<a name="treemap_value" href="#treemap_value">#</a> <i>treemap</i>.<b>value</b>([<i>function</i>])

…

<a name="treemap_sort" href="#treemap_sort">#</a> <i>treemap</i>.<b>sort</b>([<i>function</i>])

…

<a name="treemap_size" href="#treemap_size">#</a> <i>treemap</i>.<b>size</b>([<i>size</i>])

…

<a name="treemap_round" href="#treemap_round">#</a> <i>treemap</i>.<b>round</b>([<i>round</i>])

…

<a name="treemap_padding" href="#treemap_padding">#</a> <i>treemap</i>.<b>padding</b>([<i>padding</i>])

…

<a name="treemap_paddingInner" href="#treemap_paddingInner">#</a> <i>treemap</i>.<b>paddingInner</b>([<i>padding</i>])

…

<a name="treemap_paddingOuter" href="#treemap_paddingOuter">#</a> <i>treemap</i>.<b>paddingOuter</b>([<i>padding</i>])

…

### Treemap Tiling

…

<a name="treemapBinary" href="#treemapBinary">#</a> d3.<b>treemapBinary</b>(<i>node</i>, <i>x0</i>, <i>y0</i>, <i>x1</i>, <i>y1</i>)

…

<a name="treemapDice" href="#treemapDice">#</a> d3.<b>treemapDice</b>(<i>node</i>, <i>x0</i>, <i>y0</i>, <i>x1</i>, <i>y1</i>)

…

<a name="treemapSlice" href="#treemapSlice">#</a> d3.<b>treemapSlice</b>(<i>node</i>, <i>x0</i>, <i>y0</i>, <i>x1</i>, <i>y1</i>)

…

<a name="treemapSliceDice" href="#treemapSliceDice">#</a> d3.<b>treemapSliceDice</b>(<i>node</i>, <i>x0</i>, <i>y0</i>, <i>x1</i>, <i>y1</i>)

…

<a name="treemapSquarify" href="#treemapSquarify">#</a> d3.<b>treemapSquarify</b>(<i>node</i>, <i>x0</i>, <i>y0</i>, <i>x1</i>, <i>y1</i>)

…

<a name="squarify_ratio" href="#squarify_ratio">#</a> <i>squarify</i>.<b>ratio</b>(<i>ratio</i>)

…

### Partitioning

…

<a name="partition" href="#partition">#</a> d3.<b>partition</b>()

…

<a name="_partition" href="#_partition">#</a> <i>partition</i>(<i>root</i>)

…

<a name="partition_value" href="#partition_value">#</a> <i>partition</i>.<b>value</b>([<i>function</i>])

…

<a name="partition_sort" href="#partition_sort">#</a> <i>partition</i>.<b>sort</b>([<i>function</i>])

…

<a name="partition_size" href="#partition_size">#</a> <i>partition</i>.<b>size</b>([<i>size</i>])

…

<a name="partition_round" href="#partition_round">#</a> <i>partition</i>.<b>round</b>([<i>round</i>])

…

<a name="partition_padding" href="#partition_padding">#</a> <i>partition</i>.<b>padding</b>([<i>padding</i>])

…

### Circle-Packing

…

<a name="pack" href="#pack">#</a> d3.<b>pack</b>()

…

<a name="_pack" href="#_pack">#</a> <i>pack</i>(<i>root</i>)

…

<a name="pack_value" href="#pack_value">#</a> <i>pack</i>.<b>value</b>([<i>function</i>])

…

<a name="pack_sort" href="#pack_sort">#</a> <i>pack</i>.<b>sort</b>([<i>function</i>])

…

<a name="pack_size" href="#pack_size">#</a> <i>pack</i>.<b>size</b>([<i>size</i>])

…

<a name="pack_padding" href="#pack_padding">#</a> <i>pack</i>.<b>padding</b>([<i>padding</i>])

…
