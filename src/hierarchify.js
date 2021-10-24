import {stratify} from "./stratify.js";

export default function hierarchify(data, path) {
  if (typeof path !== "function") throw new Error("invalid path function");
  const D = [...data];
  const I = D.map((d, i) => normalize(path(d, i, data)));
  const P = I.map(parentof);
  const S = new Set(I);
  for (const i of P) {
    if (!S.has(i) && i) {
      S.add(i);
      D.push({path: i});
      I.push(i);
      P.push(parentof(i));
    }
  }
  return stratify(D, {id: (_, i) => I[i], parentId: (_i, i) => P[i]});
}

function normalize(path) {
  path = `${path}`.replace(/\/$/, ""); // coerce to string; strip trailing slash
  return path.startsWith("/") ? path : `/${path}`; // add leading slash if needed
}

function parentof(path) {
  return path === "/" ? "" : path.substring(0, Math.max(1, path.lastIndexOf("/")));
}
