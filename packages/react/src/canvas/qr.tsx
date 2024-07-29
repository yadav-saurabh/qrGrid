/**
 * Qr component to generate QR Code on a canvas
 * @module
 */
import { useEffect, useRef, forwardRef, useImperativeHandle, Ref } from "react";
import { QR } from "@qrgrid/core";

import { ModuleStyleFunctionParams, QrProps } from "./types";

const DEFAULT_CANVAS_SIZE = 400;
const DEFAULT_BG_COLOR = "black";
const DEFAULT_COLOR = "white";
const DEFAULT_IMG_SIZE = 0.2;
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

/**
 * Qr component draws the QR code on a canvas
 */
function QrComponent(props: QrProps, ref: Ref<HTMLCanvasElement>) {
  const { input, qrOptions, bgColor, image, color, moduleStyle } = props;

  // canvas reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // forward canvas ref to the parent component
  useImperativeHandle(ref, () => canvasRef.current!, []);

  useEffect(() => {
    if (!canvasRef?.current) {
      return;
    }
    // canvas size will adjusted with respect to module size to get a perfect square
    const canvasSize = props.size || DEFAULT_CANVAS_SIZE;

    // canvas 2d rendering context
    const ctx = canvasRef.current.getContext("2d")!;
    // pass the context by the parent to future modify the canvas
    if (props.getCanvasCtx) {
      props.getCanvasCtx(ctx);
    }

    // if no input clear the canvas
    if (!input) {
      ctx.clearRect(0, 0, canvasSize, canvasSize);
      return;
    }

    // generate the qr data
    const qr = new QR(input, qrOptions);
    // pass the qr data to the parent
    if (props.getQrData) {
      props.getQrData(qr);
    }
    // calculate module size and adjusting canvas to height and wight
    let size = Math.floor(canvasSize / (qr.noOfModules + 1.5));
    const border = Math.ceil(size * qr.noOfModules - canvasSize) + size * 2;
    canvasRef.current.height = canvasSize + border;
    canvasRef.current.width = canvasSize + border;
    // module color
    ctx.fillStyle = color && typeof color === "string" ? color : DEFAULT_COLOR;
    if (color && typeof color === "function") {
      ctx.fillStyle = color(ctx);
    }
    // use default function to draw module or use the props function
    let moduleStyleFunction = applyModuleStyle;
    if (moduleStyle && typeof moduleStyle === "function") {
      moduleStyleFunction = moduleStyle;
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
    if (image) {
      const img = new Image();
      img.src = image.src;
      img.onload = () => {
        ctx.save();
        const dHeight = canvasSize * (image.sizePercent || DEFAULT_IMG_SIZE);
        const dWidth = canvasSize * (image.sizePercent || DEFAULT_IMG_SIZE);
        const dxLogo = (canvasSize - dWidth) / 2;
        const dyLogo = (canvasSize - dHeight) / 2;

        ctx.globalAlpha = image.opacity || DEFAULT_IMG_OPACITY;
        ctx.drawImage(img, dxLogo, dyLogo, dWidth, dHeight);
        ctx.restore();
      };
    }
    // background color
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle =
      bgColor && typeof bgColor === "string" ? bgColor : DEFAULT_BG_COLOR;
    if (bgColor && typeof bgColor === "function") {
      ctx.fillStyle = bgColor(ctx);
    }
    ctx.fillRect(0, 0, canvasSize + border, canvasSize + border);
    ctx.restore();
  }, [
    input,
    qrOptions?.errorCorrection,
    bgColor,
    color,
    image?.src,
    image?.opacity,
    image?.sizePercent,
    props.size,
    moduleStyle,
  ]);

  return (
    <canvas
      height={props.size || DEFAULT_CANVAS_SIZE}
      width={props.size || DEFAULT_CANVAS_SIZE}
      ref={canvasRef}
    />
  );
}

/**
 * Qr component forwardRef
 * Qr component draws the QR code on a canvas
 */
export const Qr = forwardRef<HTMLCanvasElement, QrProps>(QrComponent);
