import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

import pkg from "./package.json" with { type: "json" };

const INPUTS = ["src/index.ts", "src/canvas/index.ts", "src/svg/index.ts"];
const EXTERNALS = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

export default defineConfig({
  build: {
    rollupOptions: {
      external: EXTERNALS,
      input: INPUTS,
      output: [
        {
          format: "es",
          entryFileNames: "[name].mjs",
          preserveModules: true,
          exports: "named",
          dir: "./dist/mjs",
        },
        {
          format: "cjs",
          entryFileNames: "[name].cjs",
          preserveModules: true,
          exports: "named",
          dir: "./dist/cjs",
        },
      ],
    },
    lib: {
      entry: INPUTS,
    },
  },
  plugins: [
    vue(),
    dts({
      outDir: "./dist/types",
      tsconfigPath: "./tsconfig.json",
    }),
  ],
});
