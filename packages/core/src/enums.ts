/**
 * exposed const to end user
 * @module
 */

/**
 * Qr Code Error Correction Levels
 */
export type ErrorCorrectionLevelType = "L" | "M" | "Q" | "H";
export const ErrorCorrectionLevel: Record<
  ErrorCorrectionLevelType,
  ErrorCorrectionLevelType
> = {
  L: "L",
  M: "M",
  Q: "Q",
  H: "H",
};

/**
 * Qr Code Modes
 */
export type ModeType = "Numeric" | "AlphaNumeric" | "Byte" | "Kanji";
export const Mode: Record<ModeType, ModeType> = {
  Numeric: "Numeric",
  AlphaNumeric: "AlphaNumeric",
  Byte: "Byte",
  Kanji: "Kanji",
};

/**
 * Reserved bits types
 */
export type ReservedBitsType =
  | "FinderPattern"
  | "AlignmentPattern"
  | "TimingPattern"
  | "FormatInfo"
  | "VersionInfo"
  | "DarkModule"
  | "Separator";
export const ReservedBits: Record<ReservedBitsType, ReservedBitsType> = {
  FinderPattern: "FinderPattern",
  AlignmentPattern: "AlignmentPattern",
  TimingPattern: "TimingPattern",
  FormatInfo: "FormatInfo",
  VersionInfo: "VersionInfo",
  DarkModule: "DarkModule",
  Separator: "Separator",
};
