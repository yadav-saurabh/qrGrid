/**
 * Qr Code Error Correction Levels
 * https://www.qrcode.com/en/about/error_correction.html
 */
export enum ErrorCorrectionLevel {
  L = "L",
  M = "M",
  Q = "Q",
  H = "H",
}

/**
 * Qr Code Modes
 */
export enum Mode {
  Numeric = "Numeric",
  AlphaNumeric = "AlphaNumeric",
  Byte = "Byte",
  Kanji = "kanji",
}
