/**
 * Publish script for @qrgrid packages.
 *
 * Publishes each library package from its dist/ directory so that:
 * - The dist/package.json (clean, no scripts/devDeps) becomes the npm manifest
 * - Only built artifacts are included (no source files)
 *
 * Before publishing, this script:
 * 1. Syncs the version from source package.json (bumped by changesets)
 * 2. Resolves workspace:* protocols to actual versions
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PACKAGES_DIR = path.resolve("packages");

// Build a map of workspace package names to their current versions
const workspaceVersions = {};
const packageDirs = fs
  .readdirSync(PACKAGES_DIR)
  .map((name) => path.join(PACKAGES_DIR, name));

for (const dir of packageDirs) {
  const pkgPath = path.join(dir, "package.json");
  if (!fs.existsSync(pkgPath)) continue;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  workspaceVersions[pkg.name] = pkg.version;
}

// Resolve workspace:* references in a dependency map
function resolveWorkspaceDeps(deps) {
  if (!deps) return deps;
  const resolved = { ...deps };
  for (const [name, version] of Object.entries(resolved)) {
    if (version.startsWith("workspace:")) {
      const realVersion = workspaceVersions[name];
      if (!realVersion) {
        console.error(`Cannot resolve workspace version for ${name}`);
        process.exit(1);
      }
      // workspace:* -> actual version, workspace:^ -> ^version
      const prefix = version.replace("workspace:", "").replace("*", "");
      resolved[name] = prefix + realVersion;
    }
  }
  return resolved;
}

const publishable = packageDirs.filter((dir) => {
  const pkgPath = path.join(dir, "package.json");
  if (!fs.existsSync(pkgPath)) return false;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  return pkg.private !== true;
});

for (const pkgDir of publishable) {
  const srcPkgPath = path.join(pkgDir, "package.json");
  const distDir = path.join(pkgDir, "dist");
  const distPkgPath = path.join(distDir, "package.json");

  if (!fs.existsSync(distPkgPath)) {
    console.log(`Skipping ${path.basename(pkgDir)} — no dist/package.json`);
    continue;
  }

  const srcPkg = JSON.parse(fs.readFileSync(srcPkgPath, "utf-8"));
  const distPkg = JSON.parse(fs.readFileSync(distPkgPath, "utf-8"));

  // Sync version from source (changesets bumps source, not dist)
  distPkg.version = srcPkg.version;

  // Resolve workspace: protocols
  distPkg.dependencies = resolveWorkspaceDeps(distPkg.dependencies);
  distPkg.peerDependencies = resolveWorkspaceDeps(distPkg.peerDependencies);

  fs.writeFileSync(distPkgPath, JSON.stringify(distPkg, null, 2) + "\n");

  console.log(`\nPublishing ${distPkg.name}@${distPkg.version}`);

  try {
    execSync("npm publish --access public", {
      cwd: distDir,
      stdio: "inherit",
    });
  } catch {
    console.error(`Failed to publish ${distPkg.name}`);
    process.exit(1);
  }
}

console.log("\nAll packages published successfully.");
