import { defineConfig } from "rollup";
import fs from "node:fs/promises";
import path from "node:path";
import ts from "@rollup/plugin-typescript";

const INPUTS = ["src/index.ts"];

const pkg = JSON.parse(await fs.readFile("./package.json"));

const EXTERNALS = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  "react/jsx-runtime",
];

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
