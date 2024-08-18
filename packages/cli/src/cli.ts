import fs from "fs";
import path from "path";

export type CliOptionMetaType = Record<
  string,
  { short: string; long: string; req?: boolean; desc?: string; bool?: boolean }
>;
const cliOptionMeta: CliOptionMetaType = {
  input: { short: "-i", long: "--input", req: true, desc: "input data" },
  file: { short: "-f", long: "--file", desc: "file path" },
  errorCorrection: {
    short: "-ec",
    long: "--errorCorrection",
    desc: "errorCorrection level for qr code",
  },
  silent: {
    short: "-s",
    long: "--silent",
    bool: true,
    desc: "skip print to terminal",
  },
};

export type CliOptionsType = Partial<
  Record<keyof typeof cliOptionMeta, string | boolean>
>;
const cliOptions: CliOptionsType = {};

function printPackageVersion() {
  const pkgPath = path.join(import.meta.dirname, "../package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  console.log(pkg.version);
  process.exit(0);
}

const helpIndex = process.argv.findIndex((arg) => /^(?:-h|--help)$/.test(arg));
const versionIndex = process.argv.findIndex((arg) =>
  /^(?:-v|--version)$/.test(arg)
);
if (helpIndex > 0) {
  console.log("Usage: qrgrid [options]\n\nOptions:");
  console.log(`${'-v'.padEnd(4)} ${"--version".padEnd(30)} output the version number`);
  Object.keys(cliOptionMeta).forEach((k) => {
    let key = k as keyof typeof cliOptionMeta;
    const { short, long, desc, bool } = cliOptionMeta[key];
    console.log(
      `${short.padEnd(4)} ${(long + (bool ? " " : " <value>")).padEnd(30)} ${desc}`
    );
  });
  console.log(`${'-h'.padEnd(4)} ${"--help".padEnd(30)} display help for command`);
  process.exit(0);
}
if (versionIndex > 0) {
  printPackageVersion();
}

Object.keys(cliOptionMeta).forEach((k) => {
  let key = k as keyof typeof cliOptionMeta;
  const { short, long, bool, req } = cliOptionMeta[key];
  const index = process.argv.findIndex((arg) =>
    new RegExp(`^(?:${short}|${long})$`).test(arg)
  );
  if (index > 0) {
    cliOptions[key] = bool ? true : process.argv[index + 1];
    if (!cliOptions[key]) {
      const err = `error: option '${short.padEnd(4)}, ${long + (bool ? " " : " <value>")}' argument missing`;
      console.log(err);
      process.exit(1);
    }
  } else if (req) {
    const err = `error: option '${short.padEnd(4)}, ${long + (bool ? " " : " <value>")}' is required`;
    console.log(err);
    process.exit(1);
  }
});

export { cliOptions };
