// import { defineConfig } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import ts from "@rollup/plugin-typescript";
import vueTsc from "vue-tsc";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import pkg from "./package.json" assert { type: "json" };

const INPUTS = [
  "src/index.ts",
  // "src/canvas/styles.tsx",
  // "src/canvas/utils.tsx",
  // "src/svg/styles.tsx",
  // "src/svg/utils.tsx",
];
const EXTERNALS = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

export default defineConfig([
  {
    input: INPUTS,
    output: {
      dir: "./dist/cjs",
      format: "cjs",
      sourcemap: true,
      preserveModules: true,
      entryFileNames: "[name].cjs",
    },
    plugins: [
      vue(),
      // commonjs(),
      ts({
        typescript: vueTsc,
        tsconfig: "./tsconfig.json",
        declaration: false,
        outDir: "./dist/cjs",
        rootDir: "src",
      }),
    ],
    external: EXTERNALS,
  },
  {
    input: INPUTS,
    output: {
      dir: "./dist/mjs",
      format: "es",
      sourcemap: true,
      preserveModules: true,
      entryFileNames: "[name].mjs",
    },
    plugins: [
      vue(),
      // commonjs(),
      ts({
        typescript: vueTsc,
        tsconfig: "./tsconfig.json",
        declaration: false,
        outDir: "./dist/mjs",
        rootDir: "src",
      }),
    ],
    external: EXTERNALS,
  },
  {
    input: INPUTS,
    output: {
      dir: "./dist/types",
      preserveModules: true,
      entryFileNames: "[name].d.ts",
    },
    plugins: [
      vue(),
      // commonjs(),
      ts({
        typescript: vueTsc,
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "./dist/types",
        rootDir: "src",
      }),
    ],
    external: EXTERNALS,
  },
]);
