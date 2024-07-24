import { QR } from "@zqr/core";
import { generateDefaultQr } from "./defaultQr";
import { ErrorCorrectionLevel } from "@zqr/core/enums";
import { generateDotQr } from "./dotQr";
import { generateColoredFinderPatternQr } from "./coloredFinderPatternQr";

// input
let input = "";
const inputElement = document.getElementById("inputText");
inputElement?.addEventListener("input", (event) => {
  input = (event.target as HTMLInputElement).value;

  if (input) {
    const qr = getQrData();
    generateAllQr(qr);
  }
});

// input
let select: ErrorCorrectionLevel = ErrorCorrectionLevel.M;
const selectElement = document.getElementById("errorCorrectionSelect");
selectElement?.addEventListener("change", (event) => {
  select = (event.target as HTMLSelectElement).value as ErrorCorrectionLevel;
  if (select) {
    const qr = getQrData();
    generateAllQr(qr);
  }
});

// button
const downloadBtn = document.getElementById("downloadBtn");
downloadBtn?.addEventListener("click", onDownloadClick);

function generateAllQr(qr: QR) {
  generateDefaultQr(qr);
  generateDotQr(qr);
  generateColoredFinderPatternQr(qr);
}

function onDownloadClick() {
  const canvas = document.getElementById("defaultQr") as HTMLCanvasElement;
  const imageType = "image/png";
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob!);
    const link = document.createElement("a");
    link.download = "zqr-example-web";
    link.href = url;
    link.click();
  }, imageType);
}

// generate qr data
function getQrData() {
  const qr = new QR(input, { errorCorrection: select });

  document.getElementById("version")!.innerText = qr.version.toString();
  document.getElementById("noOfModules")!.innerText = qr.noOfModules.toString();
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
