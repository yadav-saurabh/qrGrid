import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * @typedef {"default" | "import" | "node" | "require" | "types"} ExportTypes
 * @typedef {"main" | "module" | "types"} TopExportRefType
 */

/**
 * @type ExportTypes[]
 */
const EXPORTS_TYPES = ["default", "import", "node", "require", "types"];

/**
 * @type TopExportRefType[]
 */
const TOP_EXPORT_REF_TYPES = ["main", "module", "topTypes"];

/**
 * modify package.json files add exports
 * @param {string[]} exports input files path
 * @param {{dist:string, [key?: TopExportRefType]:{dist?:string,file: string,ext:string}, [key?: ExportTypes]:{dist?:string,ext:string}}|string} exportDetail
 * @param {string} packagePath
 */
export async function modifyExports(
  exports,
  exportDetail,
  packagePath = "./package.json"
) {
  const pkg = JSON.parse(await readFile(packagePath));
  let exportObj = {};
  let topExportRefObj = {};

  for (let i = 0; i < TOP_EXPORT_REF_TYPES.length; i++) {
    const refExport = TOP_EXPORT_REF_TYPES[i];
    const refExportData = exportDetail[refExport] || "";
    topExportRefObj[refExport === "topTypes" ? "types" : refExport] =
      refExportData
        ? path.join(
            exportDetail.dist,
            refExportData.dist,
            refExportData.file + refExportData.ext
          )
        : "";
  }

  for (let i = 0; i < exports.length; i++) {
    const exportData = exports[i];
    const file = exportData === "." ? "index" : exportData;
    exportObj[exportData] = {};
    for (let j = 0; j < EXPORTS_TYPES.length; j++) {
      const exportType = EXPORTS_TYPES[j];
      if (exportDetail[exportType]) {
        exportObj[exportData][exportType] =
          "./" +
          path.join(
            exportDetail.dist,
            exportDetail[exportType].dist,
            file + exportDetail[exportType].ext
          );
      }
    }
  }

  const result = { ...pkg, ...topExportRefObj, exports: exportObj };
  await writeFile(packagePath, JSON.stringify(result, null, 2));
}
