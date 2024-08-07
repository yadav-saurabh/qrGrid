<script setup lang="ts">
/**
 * Qr component to generate QR Code on a canvas
 * @module
 */
import { ref, onMounted, watch } from "vue";
import { QR } from "@qrgrid/core";

import { ModuleStyleFunctionParams, QrProps } from "./types";

const DEFAULT_CANVAS_SIZE = 400;
const DEFAULT_BG_COLOR = "black";
const DEFAULT_COLOR = "white";
const DEFAULT_IMG_SIZE = 20;
const DEFAULT_IMG_OPACITY = 1;

/**
 * To apply default module style
 */
function applyModuleStyle(
  ctx: ModuleStyleFunctionParams[0],
  module: ModuleStyleFunctionParams[1],
  _qr: ModuleStyleFunctionParams[2]
) {
  ctx.fillRect(module.x, module.y, module.size, module.size);
}

const props = defineProps<QrProps>();
const canvasSize = ref(props.size || DEFAULT_CANVAS_SIZE);
const canvasRef = ref<HTMLCanvasElement | null>(null);

/**
 * generateQr draws the QR code on a canvas
 */
function generateQr() {
  if (!canvasRef.value) {
    return;
  }
  // canvas size will adjusted with respect to module size to get a perfect square
  const canvasSize = props.size || DEFAULT_CANVAS_SIZE;
  // canvas 2d rendering context
  const ctx = canvasRef.value.getContext("2d")!;
  // if no input clear the canvas
  if (!props.input) {
    ctx.clearRect(0, 0, canvasRef.value.height, canvasRef.value.width);
    return;
  }
  // pass the context by the parent to future modify the canvas
  if (props.getCanvasCtx) {
    props.getCanvasCtx(ctx);
  }
  // generate the qr data
  const qr = new QR(props.input, props.qrOptions);
  // pass the qr data to the parent
  if (props.getQrData) {
    props.getQrData(qr);
  }
  // calculate module size and adjusting canvas to height and wight
  let size = Math.floor(canvasSize / (qr.noOfModules + 1.5));
  const border = Math.ceil(size * qr.noOfModules - canvasSize) + size * 2;
  canvasRef.value.height = canvasSize + border;
  canvasRef.value.width = canvasSize + border;
  // module color
  ctx.fillStyle =
    props.color && typeof props.color === "string"
      ? props.color
      : DEFAULT_COLOR;
  if (props.color && typeof props.color === "function") {
    ctx.fillStyle = props.color(ctx);
  }
  // use default function to draw module or use the props function
  let moduleStyleFunction = applyModuleStyle;
  if (props.moduleStyle && typeof props.moduleStyle === "function") {
    moduleStyleFunction = props.moduleStyle;
  }
  // placing each modules in x,y position in the canvas using fillRect
  let x = size;
  let y = size;
  for (let i = 0; i < qr.noOfModules; i++) {
    for (let j = 0; j < qr.noOfModules; j++) {
      const index = i * qr.noOfModules + j;
      const bit = qr.data[index];
      if (bit) {
        moduleStyleFunction(ctx, { index, x, y, size }, qr);
      }
      x += size;
      if (j === qr.noOfModules - 1) {
        x = size;
        y += size;
      }
    }
  }
  // if image place the image in center, QR ErrorCorrectionLevel Should be high and Image should not be more that 25-30% of the Canvas size to scan the QR code properly
  if (props.image) {
    const img = new Image();
    img.src = props.image.src;
    img.onload = () => {
      ctx.save();
      const dHeight =
        canvasSize * (props.image!.sizePercent || DEFAULT_IMG_SIZE) * 0.01;
      const dWidth =
        canvasSize * (props.image!.sizePercent || DEFAULT_IMG_SIZE) * 0.01;
      const dxLogo = (canvasSize - dWidth) / 2;
      const dyLogo = (canvasSize - dHeight) / 2;

      ctx.globalAlpha = props.image!.opacity || DEFAULT_IMG_OPACITY;
      ctx.drawImage(img, dxLogo, dyLogo, dWidth, dHeight);
      ctx.restore();
    };
  }
  // background color
  ctx.save();
  ctx.globalCompositeOperation = "destination-over";
  ctx.fillStyle =
    props.bgColor && typeof props.bgColor === "string"
      ? props.bgColor
      : DEFAULT_BG_COLOR;
  if (props.bgColor && typeof props.bgColor === "function") {
    ctx.fillStyle = props.bgColor(ctx);
  }
  ctx.fillRect(0, 0, canvasSize + border, canvasSize + border);
  ctx.restore();
  // event once everything is drawn
  if (props.onGenerated) {
    props.onGenerated(ctx, size, qr);
  }
}

onMounted(() => generateQr());
watch(props, () => {
  generateQr();
});
</script>

<!-- Qr component forwardRef  Qr component draws the QR code on a canvas / -->
<template>
  <canvas :height="canvasSize" :width="canvasSize" ref="canvasRef" />
</template>
