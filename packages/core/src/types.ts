import { ErrorCorrectionLevel, Mode } from "./enums";

/**
 * Qr Code Segments
 */
export type Segments = Array<{ value: string; mode: Mode }>;

/**
 * Options to generate a new Qr
 */
export type QrOptions = {
  errorCorrection?: keyof typeof ErrorCorrectionLevel;
};
