import dice from "./dice";
import slice from "./slice";

export default function(parent, rect) {
  (parent.depth & 1 ? slice : dice)(parent, rect);
}
