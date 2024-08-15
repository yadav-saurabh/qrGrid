import { QR, ErrorCorrectionLevel, ErrorCorrectionLevelType } from "@qrgrid/core";

// canvas qr imports
import { generateDefaultQr } from "./canvas/defaultQr";
import { generateDotQr } from "./canvas/dotQr";
import { generateColoredFinderPatternQr } from "./canvas/coloredFinderPatternQr";
import { generateSmoothEdges } from "./canvas/smoothEdgesQr";
import { downloadQr } from "./canvas/utils";
import { generateGradientQr } from "./canvas/gradientQr";

function generateQrOnCanvas(qr: QR) {
  generateDefaultQr(qr);
  generateDotQr(qr);
  generateColoredFinderPatternQr(qr);
  generateSmoothEdges(qr);
  generateGradientQr(qr);
}

// input
let input = "";
const inputElement = document.getElementById("inputText");
inputElement?.addEventListener("input", (event) => {
  input = (event.target as HTMLInputElement).value;

  if (input) {
    const qr = getQrData();
    generateQrOnCanvas(qr);
  }
});

// select
let select: ErrorCorrectionLevelType = ErrorCorrectionLevel.M;
const selectElement = document.getElementById("errorCorrectionSelect");
selectElement?.addEventListener("change", (event) => {
  select = (event.target as HTMLSelectElement).value as ErrorCorrectionLevelType;
  if (select) {
    const qr = getQrData();
    generateQrOnCanvas(qr);
  }
});

// button
const downloadBtn = document.getElementById("downloadBtn");
downloadBtn?.addEventListener("click", onDownloadClick);

function onDownloadClick() {
  const canvas = document.getElementById(
    "defaultQrCanvas"
  ) as HTMLCanvasElement;
  downloadQr(canvas);
}

// generate qr data
function getQrData() {
  const qr = new QR(input, { errorCorrection: select });

  document.getElementById("version")!.innerText = qr.version.toString();
  document.getElementById("gridSize")!.innerText = qr.gridSize.toString();
  document.getElementById("errorCorrection")!.innerText = qr.errorCorrection;
  document.getElementById("dataSize")!.innerText = qr.data.length.toString();
  document.getElementById("reservedBitSize")!.innerText = Object.keys(
    qr.reservedBits
  ).length.toString();
  document.getElementById("segments")!.innerHTML = qr.segments
    .map((d) => `<b>${d.mode}</b>: ${d.value}`)
    .join("<br>");

  return qr;
}
