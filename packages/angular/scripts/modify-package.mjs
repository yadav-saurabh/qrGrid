import fs from "fs/promises";
import path from "path";

const pkg = JSON.parse(await fs.readFile("./package.json"));
const pkgProd = JSON.parse(await fs.readFile("./dist/package.json"));

function changePath(data) {
  let modifiedData;
  if (typeof data === "object") {
    modifiedData = {};
    Object.keys(data).forEach((parentKey) => {
      modifiedData[parentKey] = {};
      Object.keys(data[parentKey]).forEach((key) => {
        if (parentKey !== "./package.json") {
          const modPath = "./" + path.join("./dist", data[parentKey][key]);
          modifiedData[parentKey][key] = modPath;
        } else {
          modifiedData[parentKey][key] = data[parentKey][key];
        }
      });
    });
  } else {
    modifiedData = path.join("./dist", data);
  }
  return modifiedData;
}

const requiredKeys = {
  exports: changePath(pkgProd.exports),
  module: changePath(pkgProd.module),
  typings: changePath(pkgProd.typings),
};
const result = { ...pkg, ...requiredKeys };
delete result.devDependencies;
delete result.scripts;

await fs.writeFile("./package.json", JSON.stringify(result, null, 2));
