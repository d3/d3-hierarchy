function sliceDice(parent, rect) {
  (parent.depth & 1 ? slice : dice)(parent, rect);
}
