import {defineConfig} from "vitest/config";

export default defineConfig({
  resolve: {alias: {"d3-hierarchy": "src/index.js"}},
  test: {include: ["test/**/*-test.js"]}
});
