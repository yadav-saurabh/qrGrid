import { defineConfig } from "rollup";
import fs from "node:fs/promises";
import path from "node:path";
import ts from "@rollup/plugin-typescript";

import { modifyExports } from "./scripts/modify-package.mjs";

const PACKAGE_PATH = "./package.json";
const INPUTS = ["src/index.ts"];
const pkg = JSON.parse(await fs.readFile(PACKAGE_PATH));
const EXTERNALS = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  "react/jsx-runtime",
];

await modifyExports(
  [".", "./canvas", "./svg"],
  {
    dist: "./dist/",
    main: { dist: "/cjs/", file: "index", ext: ".cjs" },
    module: { dist: "/mjs/", file: "index", ext: ".mjs" },
    topTypes: { dist: "/types/", file: "index", ext: ".d.ts" },
    import: { dist: "./mjs", ext: ".mjs" },
    require: { dist: "./mjs", ext: ".cjs" },
    types: { dist: "./types", ext: ".d.ts" },
  },
  PACKAGE_PATH
);

function cleanJSFiles() {
  return {
    name: "clean-js-files",
    writeBundle: async (options, bundle) => {
      const files = Object.keys(bundle).filter((file) => file.endsWith(".js"));
      await Promise.all(
        files.map((file) => fs.unlink(path.join(options.dir, file)))
      );
    },
  };
}

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
      ts({
        outputToFilesystem: true,
        tsconfig: "./tsconfig.json",
        rootDir: "src",
        outDir: "./dist/cjs",
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
      ts({
        outputToFilesystem: true,
        tsconfig: "./tsconfig.json",
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
    },
    plugins: [
      ts({
        outputToFilesystem: false,
        tsconfig: "./tsconfig.json",
        declarationDir: "./dist/types",
        rootDir: "src",
        declaration: true,
        emitDeclarationOnly: true,
      }),
      cleanJSFiles(),
    ],
    external: EXTERNALS,
  },
]);
