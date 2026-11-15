import { defineConfig } from "vite-plus/pack";

export default defineConfig({
  entry: { dommatrix: "src/index.ts" },
  format: {
    es: { platform: "neutral" },
    cjs: { dts: false, platform: "node" },
    umd: { dts: false, minify: true, platform: "browser" },
  },
  globalName: "CSSMatrix",
  sourcemap: true,
  dts: true,
  outExtensions: ({ format }) => (format === "es" ? { dts: ".d.ts" } : undefined),
  outputOptions: (options, format) =>
    format === "umd"
      ? {
          ...options,
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
          comments: false,
        }
      : {
          ...options,
          comments: { jsdoc: true, annotation: false },
        },
});
