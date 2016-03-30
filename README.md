# d3-hierarchy

…

## Installing

If you use NPM, `npm install d3-hierarchy`. Otherwise, download the [latest release](https://github.com/d3/d3-hierarchy/releases/latest).

## API Reference

* [Hierarchy](#hierarchy)
* [Treemap](#treemap)
* [Partition](#partition)
* [Pack](#pack)
* [Stratify](#stratify)

### Hierarchy

<a name="hierarchy" href="#hierarchy">#</a> d3.<b>hierarchy</b>(<i>data</i>)

Constructs a root node from the specified hierarchical *data*. The specified *data* must be an object representing the root node, and may have a *data*.children property specifying an array of data representing the children of the root node; each descendant child *data* may also have *data*.children.

For example, given the following input data:

```json
{
  "name": "Eve",
  "children": [
    {
      "name": "Cain"
    },
    {
      "name": "Seth",
      "children": [
        {
          "name": "Enos"
        },
        {
          "name": "Noam"
        }
      ]
    },
    {
      "name": "Abel"
    },
    {
      "name": "Awan",
      "children": [
        {
          "name": "Enoch"
        }
      ]
    },
    {
      "name": "Azura"
    }
  ]
}
```

The following code returns a root *node*:

```js
var root = d3.hierarchy(data);
```

The [*node*.data](#node_data) of each node in the returned hierarchy is a reference to the corresponding object in the input data. See also [Stratify](#stratify) for how to convert tabular data into a hierarchy.

<a name="node_sum" href="#node_sum">#</a> <i>node</i>.<b>sum</b>(<i>value</i>)

Evaluates the specified *value* function for *node* and each descendant of *node* in [post-order traversal](#node_eachAfter). The [value](#node_value) of each node is set to the numeric value returned by the specified function plus the combined value of all descendants. The function is passed the node’s [data](#node_data), and must return a non-negative number.

<a name="node_sort" href="#node_sort">#</a> <i>node</i>.<b>sort</b>(<i>compare</i>)

Sorts the children of *node*, if any, and each of *node*’s descendants’ children, in [pre-order traversal](#node_eachBefore) using the specified *compare* function. The specified function is passed two nodes *a* and *b* to compare. If *a* should be before *b*, the function must return a value less than zero; if *b* should be before *a*, the function must return a value greater than zero; otherwise, the relative order of *a* and *b* are not specified. See [*array*.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) for more.

<a name="node_value" href="#node_value">#</a> <i>node</i>.<b>value</b>

The combined value of this node and all its descendants; computed by [*node*.sum](#node_sum).

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

Invokes the specified *function* for *node* and each descendent in [breadth-first order](https://en.wikipedia.org/wiki/Breadth-first_search), such that a given *node* is only visited if all nodes of lesser [depth](#node_depth) have already been visited, as well as all preceeding nodes of the same depth. The specified function is passed the current *node*.

<a name="node_eachAfter" href="#node_eachAfter">#</a> <i>node</i>.<b>eachAfter</b>(<i>function</i>)

Invokes the specified *function* for *node* and each descendent in [post-order traversal](https://en.wikipedia.org/wiki/Tree_traversal#Post-order), such that a given *node* is only visited after all of its descendants have already been visited. The specified function is passed the current *node*.

<a name="node_eachBefore" href="#node_eachBefore">#</a> <i>node</i>.<b>eachBefore</b>(<i>function</i>)

Invokes the specified *function* for *node* and each descendent in [pre-order traversal](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order), such that a given *node* is only visited after all of its ancestors have already been visited. The specified function is passed the current *node*.

### Treemap

[<img alt="Treemap" src="https://raw.githubusercontent.com/d3/d3-hierarchy/master/img/treemap.png">](http://bl.ocks.org/mbostock/6bbb0a7ff7686b124d80)

Introduced by [Ben Shneiderman](http://www.cs.umd.edu/hcil/treemap-history/) in 1991, a **treemap** recursively subdivides area into rectangles according to each node’s associated value. D3’s treemap implementation supports an extensible [tiling method](#treemap_tile): the default [squarified](#treemapSquarified) method seeks to generate rectangles with a [golden](https://en.wikipedia.org/wiki/Golden_ratio) aspect ratio; this offers better readability and size estimation than [slice-and-dice](#treemapSliceDice), which simply alternates between horizontal and vertical subdivision by depth.

<a name="treemap" href="#treemap">#</a> d3.<b>treemap</b>()

Creates a new treemap layout with default settings.

<a name="_treemap" href="#_treemap">#</a> <i>treemap</i>(<i>root</i>)

Lays out the specified *root* [hierarchy](#hierarchy), assigning the following properties on *root* and its descendants:

* *node*.x0 - the left edge of the rectangle
* *node*.y0 - the top edge of the rectangle
* *node*.x1 - the right edge of the rectangle
* *node*.y1 - the bottom edge of the rectangle

You must call [*root*.sum](#node_sum) before passing the hierarchy to the treemap layout. You probably also want to call [*root*.sort](#node_sort) to order the hierarchy before computing the layout. For example:

```js
treemap(root
    .sum(function(d) { return d.value; })
    .sort(function(a, b) { return b.value - a.value; }));
```

<a name="treemap_tile" href="#treemap_tile">#</a> <i>treemap</i>.<b>tile</b>([<i>tile</i>])

If *tile* is specified, sets the [tiling method](#treemap-tiling) to the specified function and returns this treemap layout. If *tile* is not specified, returns the current tiling method, which defaults to [d3.treemapSquarify](#treemapSquarify) with the golden ratio.

<a name="treemap_size" href="#treemap_size">#</a> <i>treemap</i>.<b>size</b>([<i>size</i>])

If *size* is specified, sets the layout size to the specified two-element array [*width*, *height*] and returns this treemap layout. If *size* is not specified, returns the current size, which defaults to [1, 1].

<a name="treemap_round" href="#treemap_round">#</a> <i>treemap</i>.<b>round</b>([<i>round</i>])

If *round* is specified, enables or disables rounding according to the given boolean and returns this treemap layout. If *round* is not specified, returns the current rounding state, which defaults to false.

<a name="treemap_padding" href="#treemap_padding">#</a> <i>treemap</i>.<b>padding</b>([<i>padding</i>])

If *padding* is specified, sets the [inner](#treemap_paddingInner) and [outer](#treemap_paddingOuter) padding to the specified number or function and returns this treemap layout. If *padding* is not specified, returns the current inner padding function.

<a name="treemap_paddingInner" href="#treemap_paddingInner">#</a> <i>treemap</i>.<b>paddingInner</b>([<i>padding</i>])

If *padding* is specified, sets the inner padding to the specified number or function and returns this treemap layout. If *padding* is not specified, returns the current inner padding function, which defaults to the constant zero. If *padding* is a function, it is invoked for each node with children, being passed the current node. The inner padding is used to separate a node’s adjacent children.

<a name="treemap_paddingOuter" href="#treemap_paddingOuter">#</a> <i>treemap</i>.<b>paddingOuter</b>([<i>padding</i>])

If *padding* is specified, sets the [top](#treemap_paddingTop), [right](#treemap_paddingRight), [bottom](#treemap_paddingBottom) and [left](#treemap_paddingLeft) padding to the specified number or function and returns this treemap layout. If *padding* is not specified, returns the current top padding function.

<a name="treemap_paddingTop" href="#treemap_paddingTop">#</a> <i>treemap</i>.<b>paddingTop</b>([<i>padding</i>])

If *padding* is specified, sets the top padding to the specified number or function and returns this treemap layout. If *padding* is not specified, returns the current top padding function, which defaults to the constant zero. If *padding* is a function, it is invoked for each node with children, being passed the current node. The top padding is used to separate the top edge of a node from its children.

<a name="treemap_paddingRight" href="#treemap_paddingRight">#</a> <i>treemap</i>.<b>paddingRight</b>([<i>padding</i>])

If *padding* is specified, sets the right padding to the specified number or function and returns this treemap layout. If *padding* is not specified, returns the current right padding function, which defaults to the constant zero. If *padding* is a function, it is invoked for each node with children, being passed the current node. The right padding is used to separate the right edge of a node from its children.

<a name="treemap_paddingBottom" href="#treemap_paddingBottom">#</a> <i>treemap</i>.<b>paddingBottom</b>([<i>padding</i>])

If *padding* is specified, sets the bottom padding to the specified number or function and returns this treemap layout. If *padding* is not specified, returns the current bottom padding function, which defaults to the constant zero. If *padding* is a function, it is invoked for each node with children, being passed the current node. The bottom padding is used to separate the bottom edge of a node from its children.

<a name="treemap_paddingLeft" href="#treemap_paddingLeft">#</a> <i>treemap</i>.<b>paddingLeft</b>([<i>padding</i>])

If *padding* is specified, sets the left padding to the specified number or function and returns this treemap layout. If *padding* is not specified, returns the current left padding function, which defaults to the constant zero. If *padding* is a function, it is invoked for each node with children, being passed the current node. The left padding is used to separate the left edge of a node from its children.

#### Treemap Tiling

Several built-in tiling methods are provided for use with [*treemap*.tile](#treemap_tile).

<a name="treemapBinary" href="#treemapBinary">#</a> d3.<b>treemapBinary</b>(<i>node</i>, <i>x0</i>, <i>y0</i>, <i>x1</i>, <i>y1</i>)

Recursively partitions the specified *nodes* into an approximately-balanced binary tree, choosing horizontal partitioning for wide rectangles and vertical partitioning for tall rectangles.

<a name="treemapDice" href="#treemapDice">#</a> d3.<b>treemapDice</b>(<i>node</i>, <i>x0</i>, <i>y0</i>, <i>x1</i>, <i>y1</i>)

Divides the rectangular area specified by *x0*, *y0*, *x1*, *y1* horizontally according the value of each of the specified *node*’s children. The children are positioned in order, starting with the left edge (*x0*) of the given rectangle. If the sum of the children’s values is less than the specified *node*’s value (*i.e.*, if the specified *node* has a non-zero internal value), the remaining empty space will be positioned on the right edge (*x1*) of the given rectangle.

<a name="treemapSlice" href="#treemapSlice">#</a> d3.<b>treemapSlice</b>(<i>node</i>, <i>x0</i>, <i>y0</i>, <i>x1</i>, <i>y1</i>)

Divides the rectangular area specified by *x0*, *y0*, *x1*, *y1* vertically according the value of each of the specified *node*’s children. The children are positioned in order, starting with the top edge (*y0*) of the given rectangle. If the sum of the children’s values is less than the specified *node*’s value (*i.e.*, if the specified *node* has a non-zero internal value), the remaining empty space will be positioned on the bottom edge (*y1*) of the given rectangle.

<a name="treemapSliceDice" href="#treemapSliceDice">#</a> d3.<b>treemapSliceDice</b>(<i>node</i>, <i>x0</i>, <i>y0</i>, <i>x1</i>, <i>y1</i>)

If the specified *node* has odd depth, delegates to [treemapSlice](#treemapSlice); otherwise delegates to [treemapDice](#treemapDice).

<a name="treemapSquarify" href="#treemapSquarify">#</a> d3.<b>treemapSquarify</b>(<i>node</i>, <i>x0</i>, <i>y0</i>, <i>x1</i>, <i>y1</i>)

Implements the [squarified treemap](https://www.win.tue.nl/~vanwijk/stm.pdf) algorithm by Bruls *et al.*, which seeks to produce rectangles of a given [aspect ratio](#squarify_ratio).

<a name="squarify_ratio" href="#squarify_ratio">#</a> <i>squarify</i>.<b>ratio</b>(<i>ratio</i>)

Specifies the desired aspect ratio of the generated rectangles. The specified *ratio* is merely a hint; the rectangles are not guaranteed to have the specified aspect ratio. If not specified, the aspect ratio defaults to the golden ratio, φ = (1 + sqrt(5)) / 2, per [Kong *et al.*](http://vis.stanford.edu/papers/perception-treemaps)

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

<a name="packSiblings" href="#packSiblings">#</a> d3.<b>packSiblings</b>(<i>circles</i>)

Packs the specified array of *circles*, each of which must have a *circle*.r property specifying the circle’s radius. Assigns the following properties to each circle:

* *circle*.x - the *x*-coordinate of the circle’s center
* *circle*.y - the *y*-coordinate of the circle’s center

The circles are positioned according to the front-chain packing algorithm by [Wang *et al.*](https://dl.acm.org/citation.cfm?id=1124851)

<a name="packEnclose" href="#packEnclose">#</a> d3.<b>packEnclose</b>(<i>circles</i>)

Computes the [smallest circle](https://en.wikipedia.org/wiki/Smallest-circle_problem) that encloses the specified array of *circles*, each of which must have a *circle*.r property specifying the circle’s radius, and *circle*.x and *circle*.y properties specifying the circle’s center. The enclosing circle is computed using [Welzl’s algorithm](http://link.springer.com/chapter/10.1007/BFb0038202) adapted to enclose circles rather than points. (See also [Apollonius’ Problem](https://bl.ocks.org/mbostock/751fdd637f4bc2e3f08b).)

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
