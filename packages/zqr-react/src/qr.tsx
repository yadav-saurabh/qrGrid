import { useEffect, useRef } from "react";
import { QR, QrOptions } from "@zqr/core";

const DEFAULT_CANVAS_SIZE = 400;
const DEFAULT_BG_COLOR = "black";
const DEFAULT_COLOR = "white";

function applyModuleStyle(
  ctx: CanvasRenderingContext2D,
  coord: { index: number; x: number; y: number },
  size: number,
  _qr: QR
) {
  ctx.fillRect(coord.x, coord.y, size, size);
}

export type ModuleStyleFunctionType = (
  ctx: CanvasRenderingContext2D,
  coord: { index: number; x: number; y: number },
  size: number,
  qr: QR
) => void;

export type QrProps = {
  input: string;
  qrOptions?: QrOptions;
  size?: number;
  bgColor?: string;
  color?: string;
  theme?: (ctx: CanvasRenderingContext2D, size: number, qr: QR) => void;
  moduleStyle?: ModuleStyleFunctionType;
  getQrData?: (qr: QR) => void;
};

export function Qr(props: QrProps) {
  const { input, qrOptions, bgColor, color, moduleStyle } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef?.current) {
      return;
    }
    const canvasSize = props.size || DEFAULT_CANVAS_SIZE;

    const ctx = canvasRef.current.getContext("2d")!;

    if (!input) {
      ctx.fillStyle = bgColor || DEFAULT_BG_COLOR;
      ctx.fillRect(0, 0, canvasSize, canvasSize);
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

    ctx.fillStyle = bgColor || DEFAULT_BG_COLOR;
    ctx.fillRect(0, 0, canvasSize + border, canvasSize + border);
    ctx.fillStyle = color || DEFAULT_COLOR;

    if (props.theme) {
      props.theme(ctx, size, qr);
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
          moduleStyleFunction(ctx, { index, x, y }, size, qr);
        }
        x += size;
        if (j === qr.noOfModules - 1) {
          x = size;
          y += size;
        }
      }
    }
  }, [input, qrOptions, props.size, bgColor, color, moduleStyle, props.theme]);

  return (
    <canvas
      height={props.size || DEFAULT_CANVAS_SIZE}
      width={props.size || DEFAULT_CANVAS_SIZE}
      ref={canvasRef}
    />
  );
}
