# d3-hierarchy

…

## Installing

If you use NPM, `npm install d3-hierarchy`. Otherwise, download the [latest release](https://github.com/d3/d3-hierarchy/releases/latest).

## API Reference

…

### Hierarchies

…

<a name="hierarchyBottomUp" href="#hierarchyBottomUp">#</a> d3.<b>hierarchyBottomUp</b>()

…

<a name="_bottomUp" href="#_bottomUp">#</a> <i>bottomUp</i>(<i>data</i>)

… Returns a root [*node*](#hierarchy-nodes).

<a name="bottomUp_id" href="#bottomUp_id">#</a> <i>bottomUp</i>.<b>id</b>([<i>function</i>])

…

<a name="bottomUp_parentId" href="#bottomUp_parentId">#</a> <i>bottomUp</i>.<b>parentId</b>([<i>function</i>])

…

<a name="hierarchyTopDown" href="#hierarchyTopDown">#</a> d3.<b>hierarchyTopDown</b>()

…

<a name="_topDown" href="#_topDown">#</a> <i>topDown</i>(<i>data</i>)

… Returns a root [*node*](#hierarchy-nodes).

<a name="topDown_id" href="#topDown_id">#</a> <i>topDown</i>.<b>children</b>([<i>function</i>])

…

### Hierarchy Nodes

…

<a name="node_each" href="#node_each">#</a> <i>node</i>.<b>each</b>(<i>function</i>)

…

<a name="node_eachBefore" href="#node_eachBefore">#</a> <i>node</i>.<b>eachBefore</b>(<i>function</i>)

…

<a name="node_eachAfter" href="#node_eachAfter">#</a> <i>node</i>.<b>eachAfter</b>(<i>function</i>)

…

<a name="node_revalue" href="#node_revalue">#</a> <i>node</i>.<b>revalue</b>(<i>function</i>)

…

<a name="node_sort" href="#node_sort">#</a> <i>node</i>.<b>sort</b>(<i>function</i>)

…

<a name="node_ancestors" href="#node_ancestors">#</a> <i>node</i>.<b>ancestors</b>()

…

<a name="node_descendants" href="#node_descendants">#</a> <i>node</i>.<b>descendants</b>()

…

<a name="node_leaves" href="#node_leaves">#</a> <i>node</i>.<b>leaves</b>()

…

### Treemaps

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

### Partitions

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

<a name="packCircles" href="#packCircles">#</a> d3.<b>packCircles</b>(<i>nodes</i>)

…

<a name="packEnclosingCircle" href="#packEnclosingCircle">#</a> d3.<b>packEnclosingCircle</b>(<i>nodes</i>)

…
