import { defineConfig } from "rollup";
// import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json" assert { type: "json" };

export default defineConfig([
  {
    input: "src/index.ts",
    output: [
      {
        // dir: "./dist/cjs",
        file: "dist/index.cjs",
        format: "cjs",
        sourcemap: true,
        // preserveModules: true,
        // entryFileNames: "[name].cjs",
      },
      {
        // dir: "./dist/mjs",
        file: "dist/index.mjs",
        format: "es",
        sourcemap: true,
        // preserveModules: true,
        // entryFileNames: "[name].mjs",
      },
    ],
    plugins: [
      // nodeResolve({
      //   preferBuiltins: true,
      //   browser: false,
      // }),
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
