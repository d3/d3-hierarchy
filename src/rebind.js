export default function(layout, hierarchy) {

  layout.id = function() {
    var x = hierarchy.id.apply(hierarchy, arguments);
    return x === hierarchy ? layout : x;
  };

  layout.parentId = function() {
    var x = hierarchy.parentId.apply(hierarchy, arguments);
    return x === hierarchy ? layout : x;
  };

  layout.value = function() {
    var x = hierarchy.value.apply(hierarchy, arguments);
    return x === hierarchy ? layout : x;
  };

  layout.sort = function() {
    var x = hierarchy.sort.apply(hierarchy, arguments);
    return x === hierarchy ? layout : x;
  };

  return layout;
}
