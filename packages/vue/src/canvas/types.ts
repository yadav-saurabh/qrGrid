/**
 * Qr component types
 * @module
 */
import { QR, QrOptions } from "@qrgrid/core";

/**
 * Function type (ModuleStyleFunction is to style the module)
 */
export type ModuleStyleFunction = (
  ctx: CanvasRenderingContext2D,
  module: { index: number; x: number; y: number; size: number },
  qr: QR
) => void;

/**
 * Param Types of function ModuleStyleFunction
 */
export type ModuleStyleFunctionParams = Parameters<ModuleStyleFunction>;

/**
 * Qr component bgColor and color Prop Type
 */
export type QrColor = string | CanvasGradient | CanvasPattern;

/**
 * Qr component Image Prop Type
 */
export type QrImageOption = {
  src: string;
  sizePercent?: number;
  opacity?: number;
};

/**
 * Qr component Props Type
 */
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