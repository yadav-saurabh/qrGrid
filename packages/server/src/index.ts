/**
 * Qr function to generate QR Code as a svg
 * @module
 */
import { QrOptions, QR, ReservedBits } from "@qrgrid/core";

/**
 * Function type (ModuleStyleFunction is to style the module)
 */
export type ModuleStyleFunction = (
  path: { codeword: string; finder: string },
  module: { index: number; x: number; y: number; size: number },
  qr: QR
) => void;

export type ModuleStyleFunctionParams = Parameters<ModuleStyleFunction>;

/**
 * Qr component Props Type
 */
export type QrOptionType = {
  size?: number;
  qrOptions?: QrOptions;
  bgColor?: string;
  color?: string | { codeword?: string; finder?: string };
  moduleStyle?: ModuleStyleFunction;
  getQrData?: (qr: QR) => void;
  onGenerated?: (
    path: ModuleStyleFunctionParams[0],
    size: number,
    qr: QR
  ) => void | string;
};

const DEFAULT_SIZE = 400;
const DEFAULT_BG_COLOR = "black";
const DEFAULT_COLOR = "white";

/**
 * To apply default module style
 */
function applyModuleStyle(
  path: ModuleStyleFunctionParams[0],
  module: ModuleStyleFunctionParams[1],
  qr: QR
) {
  const { x, y, size, index } = module;
  if (qr.reservedBits[index]?.type === ReservedBits.FinderPattern) {
    path.finder += `M${x} ${y}v${size}h${size}v-${size}z`;
  } else {
    path.codeword += `M${x} ${y}v${size}h${size}v-${size}z`;
  }
}

/**
 * get the svg path color
 */
function getColor(
  colorProp: QrOptionType["color"],
  type: "finder" | "codeword"
) {
  let color = DEFAULT_COLOR;
  if (colorProp && typeof colorProp === "string") {
    color = colorProp;
  }
  if (colorProp && typeof colorProp === "object") {
    if (type === "codeword" && colorProp.codeword) {
      color = colorProp.codeword;
    }
    if (type === "finder" && colorProp.finder) {
      color = colorProp.finder;
    }
  }
  return color;
}

/**
 * generates the svg string
 */
function generateSvg(qr: QR, options?: QrOptionType) {
  // svg meta string
  const svgMeta =
    '<svg xmlns="http://www.w3.org/2000/svg" height="{{size}}" width="{{size}}" viewBox="0 0 {{size}} {{size}}" style="background: {{bgColor}};"><path id="finder" fill="{{finderColor}}" d="{{finderPath}}" /><path id="codeword" fill="{{codewordColor}}" d="{{codewordPath}}" />{{onGenerated}}</svg>';
  // calculate module size and adjusting svg to height and wight
  const initialSvgSize = options?.size || DEFAULT_SIZE;
  let size = Math.floor(initialSvgSize / (qr.gridSize + 1.5));
  const border = Math.ceil(size * qr.gridSize - initialSvgSize) + size * 2;
  const svgSize = initialSvgSize + border;
  // use default function to draw module or use the props function
  let moduleStyleFunction = applyModuleStyle;
  if (options?.moduleStyle && typeof options.moduleStyle === "function") {
    moduleStyleFunction = options.moduleStyle;
  }
  // placing each modules in x,y position in the svg
  let x = size;
  let y = size;
  let path = { finder: "", codeword: "" };
  for (let i = 0; i < qr.data.length; i++) {
    const bit = qr.data[i];
    if (bit) {
      moduleStyleFunction(path, { index: i, x, y, size }, qr);
    }
    x += size;
    if (i % qr.gridSize === qr.gridSize - 1) {
      x = size;
      y += size;
    }
  }
  // event once everything is generated but not updated the path value
  let onGeneratedString = "";
  if (options?.onGenerated) {
    onGeneratedString = options.onGenerated(path, size, qr) || "";
  }
  return svgMeta
    .replaceAll("{{size}}", svgSize.toString())
    .replace("{{bgColor}}", options?.bgColor || DEFAULT_BG_COLOR)
    .replace("{{finderColor}}", getColor(options?.color, "finder"))
    .replace("{{codewordColor}}", getColor(options?.color, "codeword"))
    .replace("{{onGenerated}}", onGeneratedString)
    .replace("{{finderPath}}", path.finder)
    .replace("{{codewordPath}}", path.codeword);
}

export function generateQr(input: string, options?: QrOptionType) {
  // generate the qr data
  const qr = new QR(input, options?.qrOptions);

  return generateSvg(qr, options);
}
