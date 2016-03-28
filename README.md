# d3-hierarchy

…

## Installing

If you use NPM, `npm install d3-hierarchy`. Otherwise, download the [latest release](https://github.com/d3/d3-hierarchy/releases/latest).

## API Reference

* [Hierarchy](#hierarchy)
* [Treemap](#treemap)
* [Partition](#partition)
* [Pack](#pack)
* [Stratify](#Stratify)

### Hierarchy

<a name="hierarchy" href="#hierarchy">#</a> d3.<b>hierarchy</b>(<i>data</i>)

Constructs a root node from the specified hierarchical *data*. The specified *data* must be an object representing the root node, and may have a *data*.children property specifying an array of data representing the children of the root node; each descendant child *data* may also have *data*.children.

For example, given the following input data:

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

The following code:

```js
var root = d3.hierarchy(data);
```

Returns the following structure:

```js
{
  "depth": 0,
  "data": [Object],
  "children": [
    {
      "depth": 1,
      "parent": [Circular],
      "data": [Object]
    },
    {
      "depth": 1,
      "parent": [Circular],
      "data": [Object]
      "children": [
        {
          "depth": 2,
          "parent": [Circular],
          "data": [Object]
        },
        {
          "depth": 2,
          "parent": [Circular],
          "data": [Object]
        }
      ]
    },
    {
      "depth": 1,
      "parent": [Circular],
      "data": [Object]
    },
    {
      "depth": 1,
      "parent": [Circular],
      "data": [Object]
      "children": [
        {
          "depth": 2,
          "parent": [Circular],
          "data": [Object]
        }
      ]
    },
    {
      "depth": 1,
      "parent": [Circular],
      "data": [Object]
    }
  ]
}
```

<a name="node_sum" href="#node_sum">#</a> <i>node</i>.<b>sum</b>(<i>function</i>)

…

<a name="node_sort" href="#node_sort">#</a> <i>node</i>.<b>sort</b>(<i>function</i>)

…

<a name="node_data" href="#node_data">#</a> <i>node</i>.<b>data</b>

A reference to the data associated with this node, as specified to the [constructor](#hierarchy).

<a name="node_depth" href="#node_depth">#</a> <i>node</i>.<b>depth</b>

The depth of the node: zero for the root node, and increasing by one for each subsequent generation.

<a name="node_parent" href="#node_parent">#</a> <i>node</i>.<b>parent</b>

A reference to the parent node; null for the root node.

<a name="node_children" href="#node_children">#</a> <i>node</i>.<b>children</b>

An array of child nodes, if any; undefined for leaf nodes.

<a name="node_ancestors" href="#node_ancestors">#</a> <i>node</i>.<b>ancestors</b>()

Returns the array of ancestors nodes, starting with this node, then followed by each parent up to the root.

<a name="node_descendants" href="#node_descendants">#</a> <i>node</i>.<b>descendants</b>()

Returns the array of descendant nodes, starting with this node, then followed by each child in topological order.

<a name="node_leaves" href="#node_leaves">#</a> <i>node</i>.<b>leaves</b>()

Returns the array of leaf nodes in traversal order; leaves are nodes with no children.

<a name="node_copy" href="#node_copy">#</a> <i>node</i>.<b>copy</b>()

Return a deep copy of the tree starting at this root *node*. (The returned deep copy shares the same [data](#node_data), however.)

<a name="node_each" href="#node_each">#</a> <i>node</i>.<b>each</b>(<i>function</i>)

…

<a name="node_eachAfter" href="#node_eachAfter">#</a> <i>node</i>.<b>eachAfter</b>(<i>function</i>)

…

<a name="node_eachBefore" href="#node_eachBefore">#</a> <i>node</i>.<b>eachBefore</b>(<i>function</i>)

…

### Treemap

[<img alt="Treemap" src="https://raw.githubusercontent.com/d3/d3-hierarchy/master/img/treemap.png">](http://bl.ocks.org/mbostock/6bbb0a7ff7686b124d80)

Introduced by [Ben Shneiderman](http://www.cs.umd.edu/hcil/treemap-history/) in 1991, a **treemap** recursively subdivides area into rectangles according to each node’s associated value. D3’s treemap implementation supports an extensible [tiling method](#treemap_tile): the default [squarified](#treemapSquarified) method seeks to generate rectangles with a [golden](https://en.wikipedia.org/wiki/Golden_ratio) aspect ratio; this offers better readability and size estimation than [slice-and-dice](#treemapSliceDice), which simply alternates between horizontal and vertical subdivision by depth.

<a name="treemap" href="#treemap">#</a> d3.<b>treemap</b>()

…

<a name="_treemap" href="#_treemap">#</a> <i>treemap</i>(<i>root</i>)

…

<a name="treemap_tile" href="#treemap_tile">#</a> <i>treemap</i>.<b>tile</b>([<i>tile</i>])

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

#### Treemap Tiling

…

<a name="treemapBinary" href="#treemapBinary">#</a> d3.<b>treemapBinary</b>(<i>node</i>, <i>x0</i>, <i>y0</i>, <i>x1</i>, <i>y1</i>)

…

<a name="treemapDice" href="#treemapDice">#</a> d3.<b>treemapDice</b>(<i>node</i>, <i>x0</i>, <i>y0</i>, <i>x1</i>, <i>y1</i>)

Divides the rectangular area specified by *x0*, *y0*, *x1*, *y1* horizontally according the value of each of the specified *node*’s children. The children are positioned in order, starting with the left edge (*x0*) of the given rectangle. If the sum of the children’s values is less than the specified *node*’s value (*i.e.*, if the specified *node* has a non-zero internal value), the remaining empty space will be positioned on the right edge (*x1*) of the given rectangle.

<a name="treemapSlice" href="#treemapSlice">#</a> d3.<b>treemapSlice</b>(<i>node</i>, <i>x0</i>, <i>y0</i>, <i>x1</i>, <i>y1</i>)

Divides the rectangular area specified by *x0*, *y0*, *x1*, *y1* vertically according the value of each of the specified *node*’s children. The children are positioned in order, starting with the top edge (*y0*) of the given rectangle. If the sum of the children’s values is less than the specified *node*’s value (*i.e.*, if the specified *node* has a non-zero internal value), the remaining empty space will be positioned on the bottom edge (*y1*) of the given rectangle.

<a name="treemapSliceDice" href="#treemapSliceDice">#</a> d3.<b>treemapSliceDice</b>(<i>node</i>, <i>x0</i>, <i>y0</i>, <i>x1</i>, <i>y1</i>)

If the specified *node* has odd depth, delegates to [treemapSlice](#treemapSlice); otherwise delegates to [treemapDice](#treemapDice).

<a name="treemapSquarify" href="#treemapSquarify">#</a> d3.<b>treemapSquarify</b>(<i>node</i>, <i>x0</i>, <i>y0</i>, <i>x1</i>, <i>y1</i>)

…

<a name="squarify_ratio" href="#squarify_ratio">#</a> <i>squarify</i>.<b>ratio</b>(<i>ratio</i>)

…

### Partition

…

<a name="partition" href="#partition">#</a> d3.<b>partition</b>()

…

<a name="_partition" href="#_partition">#</a> <i>partition</i>(<i>root</i>)

…

<a name="partition_size" href="#partition_size">#</a> <i>partition</i>.<b>size</b>([<i>size</i>])

…

<a name="partition_round" href="#partition_round">#</a> <i>partition</i>.<b>round</b>([<i>round</i>])

…

<a name="partition_padding" href="#partition_padding">#</a> <i>partition</i>.<b>padding</b>([<i>padding</i>])

…

### Pack

…

<a name="pack" href="#pack">#</a> d3.<b>pack</b>()

…

<a name="_pack" href="#_pack">#</a> <i>pack</i>(<i>root</i>)

…

<a name="pack_radius" href="#pack_radius">#</a> <i>pack</i>.<b>radius</b>([<i>radius</i>])

…

<a name="pack_size" href="#pack_size">#</a> <i>pack</i>.<b>size</b>([<i>size</i>])

…

<a name="pack_padding" href="#pack_padding">#</a> <i>pack</i>.<b>padding</b>([<i>padding</i>])

…

### Stratify

Before you can compute a hierarchical layout, you need a hierarchical data structure. If you have hierarchical data already, such as a JSON file, you can pass it directly to the hierarchical layout; otherwise, you can rearrange tabular input data, such as a comma-separated values (CSV) file, into a hierarchy using [d3.stratify](#_stratify).

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

These names are conveniently unique, so we can unambiguously represent the hierarchy as a CSV file:

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
var root = d3.stratify()(table);
```

This returns:

```js
{
  "id": "Eve",
  "depth": 0,
  "data": {
    "id": "Eve",
    "parentId": ""
  },
  "children": [
    {
      "id": "Cain",
      "depth": 1,
      "parent": [Circular],
      "data": {
        "id": "Cain",
        "parentId": "Eve"
      }
    },
    {
      "id": "Seth",
      "depth": 1,
      "parent": [Circular],
      "data": {
        "id": "Seth",
        "parentId": "Eve"
      },
      "children": [
        {
          "id": "Enos",
          "depth": 2,
          "parent": [Circular],
          "data": {
            "id": "Enos",
            "parentId": "Seth"
          }
        },
        {
          "id": "Noam",
          "depth": 2,
          "parent": [Circular],
          "data": {
             "id": "Noam",
             "parentId": "Seth"
          }
        }
      ]
    },
    {
      "id": "Abel",
      "depth": 1,
      "parent": [Circular],
      "data": {
        "id": "Abel",
        "parentId": "Eve"
      }
    },
    {
      "id": "Awan",
      "depth": 1,
      "parent": [Circular],
      "data": {
        "id": "Awan",
        "parentId": "Eve"
      },
      "children": [
        {
          "id": "Enoch",
          "depth": 2,
          "parent": [Circular],
          "data": {
             "id": "Enoch",
             "parentId": "Awan"
          }
        }
      ]
    },
    {
      "id": "Azura",
      "depth": 1,
      "parent": [Circular],
      "data": {
        "id": "Azura",
        "parentId": "Eve"
      }
    }
  ]
}
```

This hierarchy can now be passed to a hierarchical layout, such as [d3.treemap](#_treemap), for visualization. See [bl.ocks.org/6bbb0a7ff7686b124d80](http://bl.ocks.org/mbostock/6bbb0a7ff7686b124d80) for another example.

<a name="stratify" href="#stratify">#</a> d3.<b>stratify</b>()

Constructs a new stratify operator with the default settings.

<a name="_stratify" href="#_stratify">#</a> <i>stratify</i>(<i>data</i>)

Generates a new hierarchy from the specified tabular *data*. Each node in the returned object has a shallow copy of the properties from the corresponding data object, excluding the following reserved properties: id, parentId, children.

<a name="stratify_id" href="#stratify_id">#</a> <i>stratify</i>.<b>id</b>([<i>id</i>])

If *id* is specified, sets the id accessor to the given function and returns this stratify operator. Otherwise, returns the current id accessor, which defaults to:

```js
function id(d) {
  return d.id;
}
```

The id accessor is invoked for each element in the input data passed to the [stratify operator](#_stratify), being passed the current datum (*d*) and the current index (*i*). The returned string is then used to identify the node’s relationships in conjunction with the [parent id](#stratify_parentId). For leaf nodes, the id may be undefined; otherwise, the id must be unique. (Null and the empty string are equivalent to undefined.)

<a name="stratify_parentId" href="#stratify_parentId">#</a> <i>stratify</i>.<b>parentId</b>([<i>parentId</i>])

If *parentId* is specified, sets the parent id accessor to the given function and returns this stratify operator. Otherwise, returns the current parent id accessor, which defaults to:

```js
function parentId(d) {
  return d.parentId;
}
```

The parent id accessor is invoked for each element in the input data passed to the [stratify operator](#_stratify), being passed the current datum (*d*) and the current index (*i*). The returned string is then used to identify the node’s relationships in conjunction with the [id](#stratify_id). For the root node, the parent id should be undefined. (Null and the empty string are equivalent to undefined.) There must be exactly one root node in the input data, and no circular relationships.
