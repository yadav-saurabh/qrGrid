import { cp, realpath } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

/**
 * copy library files to the destination
 * @param {object} libraryObject
 * @param {string} libraryObject.lib library name
 * @param {string=} libraryObject.libSubPath Optional dir inside the library
 * @param {string} destination
 */
export async function cpLibraryDir({ lib, libSubPath = "" }, destination) {
  const require = createRequire(import.meta.url);
  const lookupPaths = require.resolve.paths(lib).map((p) => path.join(p, lib));
  const moduleDir = lookupPaths.find((p) => existsSync(p));
  const libPath = path.join(await realpath(moduleDir), libSubPath || "");
  await cp(libPath, destination, { recursive: true, force: false });
}
