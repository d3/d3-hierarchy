export default function(nodes) {
  var links = [];
  nodes.forEach(function(parent) {
    if (parent.children) parent.children.forEach(function(child) {
      links.push({source: parent, target: child});
    });
  });
  return links;
};
