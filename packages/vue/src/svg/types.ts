/**
 * Qr component types
 * @module
 */
import { QR, QrOptions } from "@qrgrid/core";

/**
 * Function type (ModuleStyleFunction is to style the module)
 */
export type ModuleStyleFunction = (
  path: { codeword: string; finder: string },
  module: { index: number; x: number; y: number; size: number },
  qr: QR
) => void;

export type ModuleStyleFunctionParams = Parameters<ModuleStyleFunction>;

/**
 * Qr component Image Prop Type
 */
export type QrImageOption = {
  src: string;
  sizePercent?: number;
  opacity?: number;
  border?: boolean;
  overlap?: boolean;
};

/**
 * Qr component Props Type
 */
export type QrProps = {
  input: string;
  size?: number;
  qrOptions?: QrOptions;
  bgColor?: string;
  color?: string | { codeword?: string; finder?: string };
  image?: QrImageOption;
  watchKey?: string | number;
  moduleStyle?: ModuleStyleFunction;
  getQrData?: (qr: QR) => void;
  onGenerated?: (
    path: ModuleStyleFunctionParams[0],
    size: number,
    qr: QR
  ) => void;
};
