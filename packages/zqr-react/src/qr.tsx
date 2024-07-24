import { useEffect, useRef, forwardRef, useImperativeHandle, Ref } from "react";
import { QR } from "@zqr/core";
import { ModuleStyleFunctionParams, QrProps } from "./types";

const DEFAULT_CANVAS_SIZE = 400;
const DEFAULT_BG_COLOR = "black";
const DEFAULT_COLOR = "white";
const DEFAULT_IMG_SIZE = 0.2;
const DEFAULT_IMG_OPACITY = 1;

function applyModuleStyle(
  ctx: ModuleStyleFunctionParams[0],
  module: ModuleStyleFunctionParams[1],
  _qr: ModuleStyleFunctionParams[2]
) {
  ctx.fillRect(module.x, module.y, module.size, module.size);
}

function QrComponent(props: QrProps, ref: Ref<HTMLCanvasElement>) {
  const { input, qrOptions, bgColor, image, color, moduleStyle } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useImperativeHandle(ref, () => canvasRef.current!, []);

  useEffect(() => {
    if (!canvasRef?.current) {
      return;
    }
    const canvasSize = props.size || DEFAULT_CANVAS_SIZE;

    const ctx = canvasRef.current.getContext("2d")!;
    if (props.getCanvasCtx) {
      props.getCanvasCtx(ctx);
    }

    if (!input) {
      ctx.clearRect(0, 0, canvasSize, canvasSize);
      return;
    }

    const qr = new QR(input, qrOptions);
    if (props.getQrData) {
      props.getQrData(qr);
    }

    let size = Math.floor(canvasSize / (qr.noOfModules + 1.5));
    const border = Math.ceil(size * qr.noOfModules - canvasSize) + size * 2;
    canvasRef.current.height = canvasSize + border;
    canvasRef.current.width = canvasSize + border;

    ctx.fillStyle = color && typeof color === "string" ? color : DEFAULT_COLOR;
    if (color && typeof color === "function") {
      ctx.fillStyle = color(ctx);
    }

    let moduleStyleFunction = applyModuleStyle;
    if (moduleStyle && typeof moduleStyle === "function") {
      moduleStyleFunction = moduleStyle;
    }

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

export const Qr = forwardRef<HTMLCanvasElement, QrProps>(QrComponent);
