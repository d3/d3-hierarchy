import assert from "assert";
import {hierarchy, hierarchify} from "../src/index.js";

it("hierarchify(data, path) returns the root node", () => {
  const root = hierarchify([
    {path: "/"},
    {path: "/aa"},
    {path: "/ab"},
    {path: "/aa/aaa"}
  ], d => d.path);
  assert(root instanceof hierarchy);
  assert.deepStrictEqual(noparent(root), {
    id: "/",
    depth: 0,
    height: 2,
    data: {path: "/"},
    children: [
      {
        id: "/aa",
        depth: 1,
        height: 1,
        data: {path: "/aa"},
        children: [
          {
            id: "/aa/aaa",
            depth: 2,
            height: 0,
            data: {path: "/aa/aaa"}
          }
        ]
      },
      {
        id: "/ab",
        depth: 1,
        height: 0,
        data: {path: "/ab"}
      }
    ]
  });
});

it("hierarchify(data, path) imputes internal nodes", () => {
  const root = hierarchify([
    {path: "/aa/aaa"},
    {path: "/ab"}
  ], d => d.path);
  assert(root instanceof hierarchy);
  assert.deepStrictEqual(noparent(root), {
    id: "/",
    depth: 0,
    height: 2,
    data: {path: "/"},
    children: [
      {
        id: "/ab",
        depth: 1,
        height: 0,
        data: {path: "/ab"}
      },
      {
        id: "/aa",
        depth: 1,
        height: 1,
        data: {path: "/aa"},
        children: [
          {
            id: "/aa/aaa",
            depth: 2,
            height: 0,
            data: {path: "/aa/aaa"}
          }
        ]
      }
    ]
  });
});

it("hierarchify(data, path) allows duplicate leaf paths", () => {
  const root = hierarchify([
    {path: "/aa/aaa"},
    {path: "/aa/aaa"},
  ], d => d.path);
  assert(root instanceof hierarchy);
  assert.deepStrictEqual(noparent(root), {
    id: "/",
    depth: 0,
    height: 2,
    data: {path: "/"},
    children: [
      {
        id: "/aa",
        depth: 1,
        height: 1,
        data: {path: "/aa"},
        children: [
          {
            id: "/aa/aaa",
            depth: 2,
            height: 0,
            data: {path: "/aa/aaa"}
          },
          {
            id: "/aa/aaa",
            depth: 2,
            height: 0,
            data: {path: "/aa/aaa"}
          }
        ]
      }
    ]
  });
});

it("hierarchify(data, path) does not allow duplicate internal paths", () => {
  assert.throws(() => {
    hierarchify([
      {path: "/aa"},
      {path: "/aa"},
      {path: "/aa/aaa"},
      {path: "/aa/aaa"},
    ], d => d.path);
  }, /ambiguous/);
});

it("hierarchify(data, path) implicitly adds leading slashes", () => {
  const root = hierarchify([
    {path: ""},
    {path: "aa"},
    {path: "ab"},
    {path: "aa/aaa"}
  ], d => d.path);
  assert(root instanceof hierarchy);
  assert.deepStrictEqual(noparent(root), {
    id: "/",
    depth: 0,
    height: 2,
    data: {path: ""},
    children: [
      {
        id: "/aa",
        depth: 1,
        height: 1,
        data: {path: "aa"},
        children: [
          {
            id: "/aa/aaa",
            depth: 2,
            height: 0,
            data: {path: "aa/aaa"}
          }
        ]
      },
      {
        id: "/ab",
        depth: 1,
        height: 0,
        data: {path: "ab"}
      }
    ]
  });
});

it("hierarchify(data, path) implicitly trims trailing slashes", () => {
  const root = hierarchify([
    {path: "/aa/"},
    {path: "/ab/"},
    {path: "/aa/aaa/"}
  ], d => d.path);
  assert(root instanceof hierarchy);
  assert.deepStrictEqual(noparent(root), {
    id: "/",
    depth: 0,
    height: 2,
    data: {path: "/"},
    children: [
      {
        id: "/aa",
        depth: 1,
        height: 1,
        data: {path: "/aa/"},
        children: [
          {
            id: "/aa/aaa",
            depth: 2,
            height: 0,
            data: {path: "/aa/aaa/"}
          }
        ]
      },
      {
        id: "/ab",
        depth: 1,
        height: 0,
        data: {path: "/ab/"}
      }
    ]
  });
});

it("hierarchify(data, path) trims at most one trailing slash", () => {
  const root = hierarchify([
    {path: "/aa///"}
  ], d => d.path);
  assert(root instanceof hierarchy);
  assert.deepStrictEqual(noparent(root), {
    id: "/",
    depth: 0,
    height: 3,
    data: {path: "/"},
    children: [
      {
        id: "/aa",
        depth: 1,
        height: 2,
        data: {path: "/aa"},
        children: [
          {
            id: "/aa/",
            depth: 2,
            height: 1,
            data: {path: "/aa/"},
            children: [
              {
                id: "/aa//",
                depth: 3,
                height: 0,
                data: {path: "/aa///"},
              }
            ]
          }
        ]
      }
    ]
  });
});

it("hierarchify(data, path) does not require the data to be in topological order", () => {
  const root = hierarchify([
    {path: "/aa/aaa"},
    {path: "/aa"},
    {path: "/ab"}
  ], d => d.path);
  assert(root instanceof hierarchy);
  assert.deepStrictEqual(noparent(root), {
    id: "/",
    depth: 0,
    height: 2,
    data: {path: "/"},
    children: [
      {
        id: "/aa",
        depth: 1,
        height: 1,
        data: {path: "/aa"},
        children: [
          {
            id: "/aa/aaa",
            depth: 2,
            height: 0,
            data: {path: "/aa/aaa"}
          }
        ]
      },
      {
        id: "/ab",
        depth: 1,
        height: 0,
        data: {path: "/ab"}
      }
    ]
  });
});

it("hierarchify(data, path) preserves the input order of siblings", () => {
  const root = hierarchify([
    {path: "/ab"},
    {path: "/aa"},
    {path: "/aa/aaa"}
  ], d => d.path);
  assert(root instanceof hierarchy);
  assert.deepStrictEqual(noparent(root), {
    id: "/",
    depth: 0,
    height: 2,
    data: {path: "/"},
    children: [
      {
        id: "/ab",
        depth: 1,
        height: 0,
        data: {path: "/ab"}
      },
      {
        id: "/aa",
        depth: 1,
        height: 1,
        data: {path: "/aa"},
        children: [
          {
            id: "/aa/aaa",
            depth: 2,
            height: 0,
            data: {path: "/aa/aaa"}
          }
        ]
      }
    ]
  });
});

it("hierarchify(data, path) accepts an iterable", () => {
  const root = hierarchify(new Set([
    {path: "/ab"},
    {path: "/aa"},
    {path: "/aa/aaa"}
  ]), d => d.path);
  assert(root instanceof hierarchy);
  assert.deepStrictEqual(noparent(root), {
    id: "/",
    depth: 0,
    height: 2,
    data: {path: "/"},
    children: [
      {
        id: "/ab",
        depth: 1,
        height: 0,
        data: {path: "/ab"}
      },
      {
        id: "/aa",
        depth: 1,
        height: 1,
        data: {path: "/aa"},
        children: [
          {
            id: "/aa/aaa",
            depth: 2,
            height: 0,
            data: {path: "/aa/aaa"}
          }
        ]
      }
    ]
  });
});

it("hierarchify(data, path) coerces paths to strings", () => {
  class Path {
    constructor(path) {
      this.path = path;
    }
    toString() {
      return this.path;
    }
  }
  const root = hierarchify([
    {path: "/ab"},
    {path: "/aa"},
    {path: "/aa/aaa"}
  ], d => new Path(d.path));
  assert(root instanceof hierarchy);
  assert.deepStrictEqual(noparent(root), {
    id: "/",
    depth: 0,
    height: 2,
    data: {path: "/"},
    children: [
      {
        id: "/ab",
        depth: 1,
        height: 0,
        data: {path: "/ab"}
      },
      {
        id: "/aa",
        depth: 1,
        height: 1,
        data: {path: "/aa"},
        children: [
          {
            id: "/aa/aaa",
            depth: 2,
            height: 0,
            data: {path: "/aa/aaa"}
          }
        ]
      }
    ]
  });
});

function noparent(node) {
  const copy = {};
  for (const k in node) {
    if (node.hasOwnProperty(k)) { // eslint-disable-line no-prototype-builtins
      switch (k) {
        case "children": copy.children = node.children.map(noparent); break;
        case "parent": break;
        default: copy[k] = node[k]; break;
      }
    }
  }
  return copy;
}
