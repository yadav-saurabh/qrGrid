import { QR, QrOptions } from "@zqr/core";

export type ModuleStyleFunction = (
  ctx: CanvasRenderingContext2D,
  module: { index: number; x: number; y: number; size: number },
  qr: QR
) => void;

export type ModuleStyleFunctionParams = Parameters<ModuleStyleFunction>;

export type QrColor = string | CanvasGradient | CanvasPattern;

export type QrImageOption = {
  src: string;
  sizePercent?: number;
  opacity?: number;
};

export type QrProps = {
  input: string;
  qrOptions?: QrOptions;
  image?: QrImageOption;
  size?: number;
  bgColor?: QrColor | ((ctx: CanvasRenderingContext2D) => QrColor);
  color?: QrColor | ((ctx: CanvasRenderingContext2D) => QrColor);
  moduleStyle?: ModuleStyleFunction;
  getQrData?: (qr: QR) => void;
  getCanvasCtx?: (ctx: CanvasRenderingContext2D) => void;
};
