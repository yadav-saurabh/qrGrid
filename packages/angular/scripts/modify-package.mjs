import fs from "fs/promises";
import path from "path";

const pkg = JSON.parse(await fs.readFile("./package.json"));
const pkgProd = JSON.parse(await fs.readFile("./dist/package.json"));

function changePath(data) {
  let modifiedData;
  if (typeof data === "object") {
    modifiedData = {};
    Object.keys(data).forEach((parentKey) => {
      let key = parentKey;
      if (parentKey.includes("./src/")) {
        key = parentKey.replace("./src/", "./");
      }
      modifiedData[key] = {};
      Object.keys(data[parentKey]).forEach((childKey) => {
        if (parentKey !== "./package.json") {
          const modPath = "./" + path.join("./dist", data[parentKey][childKey]);
          modifiedData[key][childKey] = modPath;
        } else {
          modifiedData[key][childKey] = data[parentKey][childKey];
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
