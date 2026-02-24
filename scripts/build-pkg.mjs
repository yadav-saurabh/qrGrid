/**
 * Shared post-build script for all @qrgrid library packages.
 *
 * Run from a package directory: node ../../scripts/build-pkg.mjs
 *
 * This script:
 * 1. Copies LICENSE and README.md into dist/
 * 2. Generates dist/package.json with correct exports, stripping devDeps/scripts
 *
 * It detects the dist layout automatically (flat vs mjs/cjs subdirs, or Angular fesm)
 * and derives exports from the source package.json entry points.
 */
import fs from "node:fs";
import path from "node:path";

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const distDir = "./dist";

// --- Parse catalog from pnpm-workspace.yaml ---
// Simple parser: extract "  package-name: version" lines from catalog: section
function parseCatalog() {
  const wsPath = path.resolve("../../pnpm-workspace.yaml");
  if (!fs.existsSync(wsPath)) return {};
  const content = fs.readFileSync(wsPath, "utf-8");
  const catalog = {};
  let inCatalog = false;
  for (const line of content.split("\n")) {
    if (/^catalog:/.test(line)) {
      inCatalog = true;
      continue;
    }
    if (inCatalog) {
      // End of catalog section: non-indented line that isn't empty
      if (line && !line.startsWith(" ") && !line.startsWith("\t")) break;
      const match = line.match(/^\s+"?([^":]+)"?\s*:\s*(.+)$/);
      if (match) {
        catalog[match[1].trim()] = match[2].trim();
      }
    }
  }
  return catalog;
}

const catalog = parseCatalog();

// Resolve catalog: protocols in dependency maps
function resolveCatalogDeps(deps) {
  if (!deps) return deps;
  const resolved = { ...deps };
  for (const [name, version] of Object.entries(resolved)) {
    if (version === "catalog:" || version.startsWith("catalog:")) {
      const catalogVersion = catalog[name];
      if (!catalogVersion) {
        console.error(`Cannot resolve catalog version for ${name}`);
        process.exit(1);
      }
      resolved[name] = catalogVersion;
    }
  }
  return resolved;
}

// --- 1. Copy assets ---
fs.copyFileSync("../../LICENSE", path.join(distDir, "LICENSE"));
if (fs.existsSync("./README.md")) {
  fs.copyFileSync("./README.md", path.join(distDir, "README.md"));
}

// --- 2. Generate dist/package.json ---

// Detect if this is an Angular package (ng-packagr writes its own dist/package.json)
const isAngular = fs.existsSync(path.join(distDir, "fesm2022"));

if (isAngular) {
  // Angular: ng-packagr already generated dist/package.json
  // We just merge metadata from source and normalize export keys
  const ngPkg = JSON.parse(
    fs.readFileSync(path.join(distDir, "package.json"), "utf-8"),
  );

  // Normalize export keys: ./src/canvas -> ./canvas, ./src/svg -> ./svg
  if (ngPkg.exports) {
    const normalized = {};
    for (const [key, value] of Object.entries(ngPkg.exports)) {
      const newKey = key.replace(/^\.\/src\//, "./");
      normalized[newKey] = value;
    }
    ngPkg.exports = normalized;
  }

  // Merge source metadata onto ng-packagr output
  const result = {
    ...pkg,
    module: ngPkg.module,
    typings: ngPkg.typings,
    exports: ngPkg.exports,
  };
  delete result.devDependencies;
  delete result.scripts;
  delete result.files;

  // Resolve catalog: protocols so dist/package.json is npm-publishable
  result.dependencies = resolveCatalogDeps(result.dependencies);
  result.peerDependencies = resolveCatalogDeps(result.peerDependencies);

  fs.writeFileSync(
    path.join(distDir, "package.json"),
    JSON.stringify(result, null, 2) + "\n",
  );
} else {
  // Rollup/Vite packages: derive exports from source package.json + dist layout

  // Detect layout: flat (index.mjs at dist root) vs subdirs (mjs/ + cjs/)
  const isFlat = fs.existsSync(path.join(distDir, "index.mjs"));

  // Build exports map from source exports
  const sourceExports = pkg.exports || { ".": pkg.main || "./src/index.ts" };
  const exports = {};

  for (const [entryKey, entryValue] of Object.entries(sourceExports)) {
    // Resolve the source path: could be string or object with conditions
    const srcPath =
      typeof entryValue === "string"
        ? entryValue
        : entryValue.import || entryValue.default;
    if (!srcPath) continue;

    // Convert src path to dist-relative path
    // e.g. "./src/index.ts" -> "index", "./src/canvas/index.ts" -> "canvas/index"
    //      "./src/common.ts" -> "common", "src/index.ts" -> "index"
    const relative = srcPath
      .replace(/^\.\//, "")
      .replace(/^src\//, "")
      .replace(/\.ts$/, "");

    if (isFlat) {
      // Flat layout: index.mjs, index.cjs, types/index.d.ts at dist root
      exports[entryKey] = {
        types: `./types/${relative}.d.ts`,
        import: `./${relative}.mjs`,
        require: `./${relative}.cjs`,
      };
    } else {
      // Subdir layout: mjs/X.mjs, cjs/X.cjs, types/X.d.ts
      exports[entryKey] = {
        types: `./types/${relative}.d.ts`,
        import: `./mjs/${relative}.mjs`,
        require: `./cjs/${relative}.cjs`,
      };
    }
  }

  // Determine main/module/types from the "." export
  const mainExport = exports["."] || {};
  const result = {
    ...pkg,
    main: mainExport.require,
    module: mainExport.import,
    types: mainExport.types,
    exports,
  };
  delete result.devDependencies;
  delete result.scripts;
  delete result.files;

  // Fix bin paths: strip "dist/" prefix since we publish from dist/
  // e.g. "./dist/index.mjs" -> "./index.mjs"
  if (result.bin) {
    for (const [cmd, binPath] of Object.entries(result.bin)) {
      result.bin[cmd] = binPath.replace(/^\.\/dist\//, "./");
    }
  }

  // Resolve catalog: protocols so dist/package.json is npm-publishable
  result.dependencies = resolveCatalogDeps(result.dependencies);
  result.peerDependencies = resolveCatalogDeps(result.peerDependencies);

  fs.writeFileSync(
    path.join(distDir, "package.json"),
    JSON.stringify(result, null, 2) + "\n",
  );
}
