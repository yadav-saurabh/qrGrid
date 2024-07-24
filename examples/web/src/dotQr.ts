import { QR } from "@zqr/core";

const DEFAULT_CANVAS_SIZE = 400;
const DEFAULT_BG_COLOR = "black";
const DEFAULT_COLOR = "white";

const description = document.createElement("p");
description.innerText = "dotQr";

const div = document.createElement("div");
div.className = "qr";
document.getElementById("qrContainer")?.appendChild(div);

const canvas = document.createElement("canvas");
div.appendChild(canvas);
div.appendChild(description);

export function generateDotQr(qr: QR) {
  const ctx = canvas.getContext("2d")!;
  const canvasSize = DEFAULT_CANVAS_SIZE;

  let size = Math.floor(canvasSize / (qr.noOfModules + 1.5));
  const border = Math.ceil(size * qr.noOfModules - canvasSize) + size * 2;
  canvas.height = canvasSize + border;
  canvas.width = canvasSize + border;
  ctx.fillStyle = DEFAULT_COLOR;

  let x = size;
  let y = size;
  const radius = Math.floor(size / 2);
  const radian = 2 * Math.PI;
  for (let i = 0; i < qr.data.length; i++) {
    const bit = qr.data[i];
    if (bit) {
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius, 0, radian);
      ctx.fill();
    }
    x += size;
    if (i % qr.noOfModules === qr.noOfModules - 1) {
      x = size;
      y += size;
    }
  }

  ctx.globalCompositeOperation = "destination-over";
  ctx.fillStyle = DEFAULT_BG_COLOR;
  ctx.fillRect(0, 0, canvasSize + border, canvasSize + border);
}
