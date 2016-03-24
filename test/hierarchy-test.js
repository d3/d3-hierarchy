var tape = require("tape"),
    d3_hierarchy = require("../");

tape("hierarchy() has the expected defaults", function(test) {
  var h = d3_hierarchy.hierarchy();
  test.equal(h.id()({id: "foo"}), "foo");
  test.equal(h.parentId()({parentId: "bar"}), "bar");
  test.end();
});

tape("hierarchy(data) returns the root node", function(test) {
  var h = d3_hierarchy.hierarchy();
  test.deepEqual(h([
    {id: "a"},
    {id: "aa", parentId: "a"},
    {id: "ab", parentId: "a"},
    {id: "aaa", parentId: "aa"}
  ]), {
    id: "a",
    children: [
      {
        id: "aa",
        parentId: "a",
        children: [
          {
            id: "aaa",
            parentId: "aa"
          }
        ]
      },
      {
        id: "ab",
        parentId: "a"
      }
    ]
  });
  test.end();
});

tape("hierarchy(data) does not require the data to be in topological order", function(test) {
  var h = d3_hierarchy.hierarchy();
  test.deepEqual(h([
    {id: "aaa", parentId: "aa"},
    {id: "aa", parentId: "a"},
    {id: "ab", parentId: "a"},
    {id: "a"}
  ]), {
    id: "a",
    children: [
      {
        id: "aa",
        parentId: "a",
        children: [
          {
            id: "aaa",
            parentId: "aa"
          }
        ]
      },
      {
        id: "ab",
        parentId: "a"
      }
    ]
  });
  test.end();
});

tape("hierarchy(data) preserves the input order of siblings", function(test) {
  var h = d3_hierarchy.hierarchy();
  test.deepEqual(h([
    {id: "aaa", parentId: "aa"},
    {id: "ab", parentId: "a"},
    {id: "aa", parentId: "a"},
    {id: "a"}
  ]), {
    id: "a",
    children: [
      {
        id: "ab",
        parentId: "a"
      },
      {
        id: "aa",
        parentId: "a",
        children: [
          {
            id: "aaa",
            parentId: "aa"
          }
        ]
      }
    ]
  });
  test.end();
});

tape("hierarchy(data) throws an error if the data does not have a single root", function(test) {
  var h = d3_hierarchy.hierarchy();
  test.throws(function() { h([{id: "a"}, {id: "b"}]); }, /\bmultiple roots\b/);
  test.throws(function() { h([{id: "a", parentId: "a"}]); }, /\bno root\b/);
  test.throws(function() { h([{id: "a", parentId: "b"}, {id: "b", parentId: "a"}]); }, /\bno root\b/);
  test.end();
});

tape("hierarchy(data) throws an error if the hierarchy is cyclical", function(test) {
  var h = d3_hierarchy.hierarchy();
  test.throws(function() { h([{id: "root"}, {id: "a", parentId: "a"}]); }, /\bcycle\b/);
  test.throws(function() { h([{id: "root"}, {id: "a", parentId: "b"}, {id: "b", parentId: "a"}]); }, /\bcycle\b/);
  test.end();
});

tape("hierarchy(data) throws an error if multiple nodes have the same id", function(test) {
  var h = d3_hierarchy.hierarchy();
  test.throws(function() { h([{id: "foo"}, {id: "foo"}]); }, /\bduplicate\b/);
  test.end();
});

tape("hierarchy(data) throws an error if the specified parent is not found", function(test) {
  var h = d3_hierarchy.hierarchy();
  test.throws(function() { h([{id: "a"}, {id: "b", parentId: "c"}]); }, /\bmissing\b/);
  test.end();
});

tape("hierarchy(data) allows the id to be undefined for leaf nodes", function(test) {
  var h = d3_hierarchy.hierarchy();
  test.deepEqual(h([
    {id: "a"},
    {parentId: "a"},
    {parentId: "a"}
  ]), {
    id: "a",
    children: [
      {
        parentId: "a"
      },
      {
        parentId: "a"
      }
    ]
  });
  test.end();
});

tape("hierarchy(data) coerces the id to a string, if not nully", function(test) {
  var h = d3_hierarchy.hierarchy();
  test.strictEqual(h([{id: {toString: function() { return "a"}}}]).id, "a");
  test.strictEqual(h([{id: null}]).id, undefined);
  test.strictEqual(h([{id: undefined}]).id, undefined);
  test.strictEqual(h([{}]).id, undefined);
  test.end();
});

tape("hierarchy(data) allows the id to be undefined for leaf nodes", function(test) {
  var o = {parentId: {toString: function() { return "a"; }}}, h = d3_hierarchy.hierarchy();
  test.deepEqual(h([{id: "a"}, o]), {id: "a", children: [o]});
  test.end();
});

tape("hierarchy.id(id) observes the specified id function", function(test) {
  var foo = function(d) { return d.foo; },
      h = d3_hierarchy.hierarchy().id(foo);
  test.equal(h.id(), foo);
  test.deepEqual(h([
    {foo: "a"},
    {foo: "aa", parentId: "a"},
    {foo: "ab", parentId: "a"},
    {foo: "aaa", parentId: "aa"}
  ]), {
    id: "a",
    foo: "a",
    children: [
      {
        id: "aa",
        foo: "aa",
        parentId: "a",
        children: [
          {
            id: "aaa",
            foo: "aaa",
            parentId: "aa"
          }
        ]
      },
      {
        id: "ab",
        foo: "ab",
        parentId: "a"
      }
    ]
  });
  test.end();
});

tape("hierarchy.id(id) tests that id is a function", function(test) {
  var h = d3_hierarchy.hierarchy();
  test.throws(function() { h.id(42); });
  test.throws(function() { h.id(null); });
  test.end();
});

tape("hierarchy.parentId(id) observes the specified parent id function", function(test) {
  var foo = function(d) { return d.foo; },
      h = d3_hierarchy.hierarchy().parentId(foo);
  test.equal(h.parentId(), foo);
  test.deepEqual(h([
    {id: "a"},
    {id: "aa", foo: "a"},
    {id: "ab", foo: "a"},
    {id: "aaa", foo: "aa"}
  ]), {
    id: "a",
    children: [
      {
        id: "aa",
        foo: "a",
        children: [
          {
            id: "aaa",
            foo: "aa"
          }
        ]
      },
      {
        id: "ab",
        foo: "a"
      }
    ]
  });
  test.end();
});

tape("hierarchy.parentId(id) tests that id is a function", function(test) {
  var h = d3_hierarchy.hierarchy();
  test.throws(function() { h.parentId(42); });
  test.throws(function() { h.parentId(null); });
  test.end();
});
