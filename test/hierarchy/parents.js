var noparent = require("./noparent");

module.exports = function(root) {
  return root.descendants().map(function(d) {
    return noparent(d.parent);
  });
};
