import {
  QR,
  ErrorCorrectionLevel,
  ErrorCorrectionLevelType,
} from "@qrgrid/core";
import { downloadQr as canvasDownloadQr } from "@qrgrid/styles/canvas";
import { downloadQr as svgDownloadQr } from "@qrgrid/styles/svg";

import { generateCanvas } from "./canvas/index";
import { generateSvg } from "./svg/index";

function generateQrOnCanvas(qr: QR) {
  generateCanvas(qr);
}

// input
let input = "";
const inputElement = document.getElementById("inputText");
inputElement?.addEventListener("input", (event) => {
  input = (event.target as HTMLInputElement).value;

  if (input) {
    const qr = getQrData();
    generateQrOnCanvas(qr);
    generateSvg(qr);
  }
});

// select
let select: ErrorCorrectionLevelType = ErrorCorrectionLevel.M;
const selectElement = document.getElementById("errorCorrectionSelect");
selectElement?.addEventListener("change", (event) => {
  select = (event.target as HTMLSelectElement)
    .value as ErrorCorrectionLevelType;
  if (select) {
    const qr = getQrData();
    generateQrOnCanvas(qr);
  }
});

// button
const downloadBtn = document.getElementById("downloadBtn");
downloadBtn?.addEventListener("click", onDownloadClick);
const svgDownloadBtn = document.getElementById("svgDownloadBtn");
svgDownloadBtn?.addEventListener("click", onSvgDownloadClick);

function onDownloadClick() {
  const canvas = document.getElementById(
    "defaultQrCanvas",
  ) as HTMLCanvasElement;
  canvasDownloadQr(canvas);
}

function onSvgDownloadClick() {
  const svg = document.getElementById(
    "defaultQrSvg",
  ) as unknown as SVGSVGElement;
  svgDownloadQr(svg);
}

// generate qr data
function getQrData() {
  const qr = new QR(input, { errorCorrection: select });

  // info for canvas
  document.getElementById("version")!.innerText = qr.version.toString();
  document.getElementById("gridSize")!.innerText = qr.gridSize.toString();
  document.getElementById("errorCorrection")!.innerText = qr.errorCorrection;
  document.getElementById("dataSize")!.innerText = qr.data.length.toString();
  document.getElementById("reservedBitSize")!.innerText = Object.keys(
    qr.reservedBits,
  ).length.toString();
  document.getElementById("segments")!.innerHTML = qr.segments
    .map((d) => `<b>${d.mode}</b>: ${d.value}`)
    .join("<br>");

  // info for svg
  document.getElementById("svgVersion")!.innerText = qr.version.toString();
  document.getElementById("svgGridSize")!.innerText = qr.gridSize.toString();
  document.getElementById("svgErrorCorrection")!.innerText = qr.errorCorrection;
  document.getElementById("svgDataSize")!.innerText = qr.data.length.toString();
  document.getElementById("svgReservedBitSize")!.innerText = Object.keys(
    qr.reservedBits,
  ).length.toString();
  document.getElementById("svgSegments")!.innerHTML = qr.segments
    .map((d) => `<b>${d.mode}</b>: ${d.value}`)
    .join("<br>");

  return qr;
}
