import { QR, QrOptions } from "@zqr/core";

export type ModuleStyleFunction = (
  ctx: CanvasRenderingContext2D,
  module: { index: number; x: number; y: number; size: number },
  qr: QR
) => void;

export type ModuleStyleFunctionParams = Parameters<ModuleStyleFunction>;

export type QrColor = string | CanvasGradient | CanvasPattern;

export type QrProps = {
  input: string;
  qrOptions?: QrOptions;
  size?: number;
  bgColor?: QrColor | ((ctx: CanvasRenderingContext2D) => QrColor);
  color?: QrColor | ((ctx: CanvasRenderingContext2D) => QrColor);
  onFinish?: (ctx: CanvasRenderingContext2D, size: number, qr: QR) => void;
  moduleStyle?: ModuleStyleFunction;
  getQrData?: (qr: QR) => void;
  getCanvasCtx?: (ctx: CanvasRenderingContext2D) => void;
};
