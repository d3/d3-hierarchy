var tape = require("tape"),
    d3_hierarchy = require("../");

tape("stratify() has the expected defaults", function(test) {
  var s = d3_hierarchy.stratify();
  test.equal(s.id()({id: "foo"}), "foo");
  test.equal(s.parentId()({parentId: "bar"}), "bar");
  test.end();
});

tape("stratify(data) returns the root node", function(test) {
  var s = d3_hierarchy.stratify();
  test.deepEqual(s([
    {id: "a"},
    {id: "aa", parentId: "a"},
    {id: "ab", parentId: "a"},
    {id: "aaa", parentId: "aa"}
  ]), {
    id: "a",
    children: [
      {
        id: "aa",
        children: [
          {
            id: "aaa"
          }
        ]
      },
      {
        id: "ab"
      }
    ]
  });
  test.end();
});

tape("stratify(data) does not require the data to be in topological order", function(test) {
  var s = d3_hierarchy.stratify();
  test.deepEqual(s([
    {id: "aaa", parentId: "aa"},
    {id: "aa", parentId: "a"},
    {id: "ab", parentId: "a"},
    {id: "a"}
  ]), {
    id: "a",
    children: [
      {
        id: "aa",
        children: [
          {
            id: "aaa"
          }
        ]
      },
      {
        id: "ab"
      }
    ]
  });
  test.end();
});

tape("stratify(data) preserves the input order of siblings", function(test) {
  var s = d3_hierarchy.stratify();
  test.deepEqual(s([
    {id: "aaa", parentId: "aa"},
    {id: "ab", parentId: "a"},
    {id: "aa", parentId: "a"},
    {id: "a"}
  ]), {
    id: "a",
    children: [
      {
        id: "ab"
      },
      {
        id: "aa",
        children: [
          {
            id: "aaa"
          }
        ]
      }
    ]
  });
  test.end();
});

tape("stratify(data) treats an empty parentId as the root", function(test) {
  var s = d3_hierarchy.stratify();
  test.deepEqual(s([
    {id: "a", parentId: ""},
    {id: "aa", parentId: "a"},
    {id: "ab", parentId: "a"},
    {id: "aaa", parentId: "aa"}
  ]), {
    id: "a",
    children: [
      {
        id: "aa",
        children: [
          {
            id: "aaa"
          }
        ]
      },
      {
        id: "ab"
      }
    ]
  });
  test.end();
});

tape("stratify(data) does not treat a falsy but non-empty parentId as the root", function(test) {
  var s = d3_hierarchy.stratify();
  test.deepEqual(s([
    {id: 0, parentId: null},
    {id: 1, parentId: 0},
    {id: 2, parentId: 0}
  ]), {
    id: "0",
    children: [
      {
        id: "1"
      },
      {
        id: "2"
      }
    ]
  });
  test.end();
});

tape("stratify(data) throws an error if the data does not have a single root", function(test) {
  var s = d3_hierarchy.stratify();
  test.throws(function() { s([{id: "a"}, {id: "b"}]); }, /\bmultiple roots\b/);
  test.throws(function() { s([{id: "a", parentId: "a"}]); }, /\bno root\b/);
  test.throws(function() { s([{id: "a", parentId: "b"}, {id: "b", parentId: "a"}]); }, /\bno root\b/);
  test.end();
});

tape("stratify(data) throws an error if the hierarchy is cyclical", function(test) {
  var s = d3_hierarchy.stratify();
  test.throws(function() { s([{id: "root"}, {id: "a", parentId: "a"}]); }, /\bcycle\b/);
  test.throws(function() { s([{id: "root"}, {id: "a", parentId: "b"}, {id: "b", parentId: "a"}]); }, /\bcycle\b/);
  test.end();
});

tape("stratify(data) throws an error if multiple nodes have the same id", function(test) {
  var s = d3_hierarchy.stratify();
  test.throws(function() { s([{id: "foo"}, {id: "foo"}]); }, /\bduplicate\b/);
  test.end();
});

tape("stratify(data) throws an error if the specified parent is not found", function(test) {
  var s = d3_hierarchy.stratify();
  test.throws(function() { s([{id: "a"}, {id: "b", parentId: "c"}]); }, /\bmissing\b/);
  test.end();
});

tape("stratify(data) allows the id to be undefined for leaf nodes", function(test) {
  var s = d3_hierarchy.stratify();
  test.deepEqual(s([
    {id: "a"},
    {parentId: "a"},
    {parentId: "a"}
  ]), {
    id: "a",
    children: [
      {},
      {}
    ]
  });
  test.end();
});

tape("stratify(data) coerces the id to a string, if not null and not empty", function(test) {
  var s = d3_hierarchy.stratify();
  test.strictEqual(s([{id: {toString: function() { return "a"}}}]).id, "a");
  test.strictEqual(s([{id: ""}]).id, undefined);
  test.strictEqual(s([{id: null}]).id, undefined);
  test.strictEqual(s([{id: undefined}]).id, undefined);
  test.strictEqual(s([{}]).id, undefined);
  test.end();
});

tape("stratify(data) allows the id to be undefined for leaf nodes", function(test) {
  var s = d3_hierarchy.stratify();
  test.deepEqual(s([{id: "a"}, {parentId: {toString: function() { return "a"; }}}]), {id: "a", children: [{}]});
  test.end();
});

tape("stratify.id(id) observes the specified id function", function(test) {
  var foo = function(d) { return d.foo; },
      s = d3_hierarchy.stratify().id(foo);
  test.equal(s.id(), foo);
  test.deepEqual(s([
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
        children: [
          {
            id: "aaa",
            foo: "aaa"
          }
        ]
      },
      {
        id: "ab",
        foo: "ab"
      }
    ]
  });
  test.end();
});

tape("stratify.id(id) tests that id is a function", function(test) {
  var s = d3_hierarchy.stratify();
  test.throws(function() { s.id(42); });
  test.throws(function() { s.id(null); });
  test.end();
});

tape("stratify.parentId(id) observes the specified parent id function", function(test) {
  var foo = function(d) { return d.foo; },
      s = d3_hierarchy.stratify().parentId(foo);
  test.equal(s.parentId(), foo);
  test.deepEqual(s([
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

tape("stratify.parentId(id) tests that id is a function", function(test) {
  var s = d3_hierarchy.stratify();
  test.throws(function() { s.parentId(42); });
  test.throws(function() { s.parentId(null); });
  test.end();
});
