<script setup lang="ts">
/**
 * Qr component to generate QR Code on a canvas
 * @module
 */
import { ref, onMounted, watch } from "vue";
import { QR } from "@qrgrid/core";

import {
  ModuleStyleFunction,
  ModuleStyleFunctionParams,
  QrProps,
} from "./types";

const DEFAULT_CANVAS_SIZE = 400;
const DEFAULT_BG_COLOR = "black";
const DEFAULT_COLOR = "white";
const DEFAULT_IMG_SIZE = 15;
const DEFAULT_IMG_OPACITY = 1;
const DEFAULT_IMG_BORDER = false;
const DEFAULT_IMG_OVERLAP = true;

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
// const canvasSize = ref(props.size || DEFAULT_CANVAS_SIZE);
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
  let size = Math.floor(canvasSize / (qr.gridSize + 1.5));
  const border = Math.ceil(size * qr.gridSize - canvasSize) + size * 2;
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
  // if image place the image in center, QR ErrorCorrectionLevel Should be high and Image should not be more that 25-30% of the Canvas size to scan the QR code properly
  if (props.image) {
    drawImageInCenter(ctx, qr, size, moduleStyleFunction);
    return;
  }
  // placing each modules in x,y position in the canvas using fillRect
  drawQrModules(ctx, qr, size, moduleStyleFunction);
  // background color
  drawBackgroundColor(ctx);
  // event once everything is drawn
  if (props.onGenerated) {
    props.onGenerated(ctx, size, qr);
  }
}

function drawImageInCenter(
  ctx: CanvasRenderingContext2D,
  qr: QR,
  size: number,
  moduleStyleFunction: ModuleStyleFunction
) {
  const img = new Image();
  img.src = props.image!.src;
  // set overlap and border to bool if undefined
  props.image!.overlap =
    props.image!.overlap === undefined
      ? DEFAULT_IMG_OVERLAP
      : props.image!.overlap;
  props.image!.border =
    props.image!.border === undefined
      ? DEFAULT_IMG_BORDER
      : props.image!.border;
  img.onload = () => {
    const canvasSize = canvasRef.value!.height;
    // clear previous canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    // Calculate the desired height and width while maintaining the aspect ratio
    const maxImgSizePercent = props.image?.sizePercent || DEFAULT_IMG_SIZE;
    const maxDimension = canvasSize * (maxImgSizePercent * 0.01);
    let dHeight = img.width;
    let dWidth = img.height;
    // Calculate aspect ratio
    const imgAspectRatio = img.width / img.height;
    if (dWidth > dHeight) {
      dWidth = maxDimension;
      dHeight = maxDimension / imgAspectRatio;
    } else {
      dHeight = maxDimension;
      dWidth = maxDimension * imgAspectRatio;
    }
    const dxLogo = (canvasSize - dWidth) / 2;
    const dyLogo = (canvasSize - dHeight) / 2;

    // draw qr module first
    const imgArea = {
      x: dxLogo,
      y: dyLogo,
      dx: dxLogo + dWidth,
      dy: dyLogo + dHeight,
    };
    // qr modules
    drawQrModules(ctx, qr, size, moduleStyleFunction, imgArea);
    // draw image
    ctx.save();
    ctx.globalAlpha = props.image?.opacity || DEFAULT_IMG_OPACITY;
    ctx.drawImage(img, dxLogo, dyLogo, dWidth, dHeight);
    ctx.restore();
    // background color
    drawBackgroundColor(ctx);
    // event once everything is drawn
    if (props.onGenerated) {
      props.onGenerated(ctx, size, qr);
    }
  };
  img.onerror = () => {
    console.error("qrgrid: Error while loading the image");
    // qr modules
    drawQrModules(ctx, qr, size, moduleStyleFunction);
    // background color
    drawBackgroundColor(ctx);
    // event once everything is drawn
    if (props.onGenerated) {
      props.onGenerated(ctx, size, qr);
    }
  };
}

// placing each modules in x,y position in the canvas using fillRect
function drawQrModules(
  ctx: CanvasRenderingContext2D,
  qr: QR,
  size: number,
  moduleStyleFunction: ModuleStyleFunction,
  imgArea?: { x: number; y: number; dx: number; dy: number }
) {
  let x = size;
  let y = size;
  for (let i = 0; i < qr.data.length; i++) {
    const bit = qr.data[i];
    if (bit && !overlappingImage({ x, y, size }, imgArea)) {
      moduleStyleFunction(ctx, { index: i, x, y, size }, qr);
    }
    x += size;
    if (i % qr.gridSize === qr.gridSize - 1) {
      x = size;
      y += size;
    }
  }
}

function overlappingImage(
  module: { x: number; y: number; size: number },
  imgArea?: { x: number; y: number; dx: number; dy: number }
): boolean {
  if (!imgArea || props.image?.overlap === true) {
    return false;
  }

  const moduleXEnd = module.x + module.size;
  const moduleYEnd = module.y + module.size;
  const border = props.image?.border ? module.size : 0;

  return (
    module.x < imgArea.dx + border &&
    module.y < imgArea.dy + border &&
    moduleXEnd > imgArea.x - border &&
    moduleYEnd > imgArea.y - border
  );
}

// background color
function drawBackgroundColor(ctx: CanvasRenderingContext2D) {
  const size = canvasRef.value!.height;
  ctx.save();
  ctx.globalCompositeOperation = "destination-over";
  ctx.fillStyle =
    typeof props.bgColor === "function"
      ? props.bgColor(ctx)
      : props.bgColor || DEFAULT_BG_COLOR;

  ctx.fillRect(0, 0, size, size);
  ctx.restore();
}

onMounted(() => generateQr());
watch(
  [
    () => props.input,
    () => props.qrOptions?.errorCorrection,
    () => props.size,
    () => props.image?.src,
    () => props.image?.opacity,
    () => props.image?.sizePercent,
    () => props.image?.overlap,
    () => props.image?.border,
    () => props.watchKey,
  ],
  () => {
    generateQr();
  }
);
defineExpose({ canvasRef });
</script>

<!-- Qr component forwardRef  Qr component draws the QR code on a canvas / -->
<template>
  <canvas
    :height="props.size || DEFAULT_CANVAS_SIZE"
    :width="props.size || DEFAULT_CANVAS_SIZE"
    ref="canvasRef"
  />
</template>
