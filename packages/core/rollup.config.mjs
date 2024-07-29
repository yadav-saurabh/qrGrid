import { defineConfig } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

import pkg from "./package.json" assert { type: "json" };

export default defineConfig([
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.cjs",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/index.mjs",
        format: "es",
        sourcemap: true,
      },
    ],
    plugins: [
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        outDir: "./dist",
        declarationDir: "./dist/types",
        rootDir: "src",
      }),
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
]);
