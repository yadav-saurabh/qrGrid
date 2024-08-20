import fs from "fs/promises";

const pkg = JSON.parse(await fs.readFile("./package.json"));
const pkgProd = JSON.parse(await fs.readFile("./dist/package.json"));

const requiredKeys = {
  exports: pkgProd.exports,
  module: pkgProd.module,
  typings: pkgProd.typings,
};
const result = { ...pkg, ...requiredKeys };
delete result.devDependencies;
delete result.scripts;

await fs.writeFile("./package.json", JSON.stringify(result, null, 2));
