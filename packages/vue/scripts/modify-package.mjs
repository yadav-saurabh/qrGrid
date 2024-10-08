import fs from "fs/promises";

const pkg = JSON.parse(await fs.readFile("./package.json"));
const pkgProd = JSON.parse(await fs.readFile("./package-prod.config"));

const result = { ...pkg, ...pkgProd };
delete result.devDependencies;
delete result.scripts;

await fs.writeFile("./package.json", JSON.stringify(result, null, 2));
