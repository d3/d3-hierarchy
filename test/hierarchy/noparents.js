var noparent = require("./noparent");

module.exports = function(root) {
  return root.descendants().map(noparent);
};
