/**
 * Qr component types
 * @module
 */
import { QR, QrOptions } from "@qrgrid/core";

export type QrImageOption = {
  src: string;
  sizePercent?: number;
  opacity?: number;
};

export type ModuleStyleFunction = (
  path: { codeword: string; finder: string },
  module: { index: number; x: number; y: number; size: number },
  qr: QR
) => void;

export type ModuleStyleFunctionParams = Parameters<ModuleStyleFunction>;

export type QrProps = {
  input: string;
  size?: number;
  qrOptions?: QrOptions;
  bgColor?: string;
  color?: string;
  image?: QrImageOption;
  moduleStyle?: ModuleStyleFunction;
  getQrData?: (qr: QR) => void;
};
