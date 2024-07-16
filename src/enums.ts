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
  Kanji = "Kanji",
}

/**
 * Reserved bits types
 */
export enum ReservedBits {
  FinderPattern = "FinderPattern",
  AlignmentPattern = "AlignmentPattern",
  TimingPattern = "TimingPattern",
  FormatInfo = "FormatInfo",
  VersionInfo = "VersionInfo",
  DarkModule = "DarkModule",
  Separator = "Separator",
}
