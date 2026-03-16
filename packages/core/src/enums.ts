/**
 * Public-facing constants and types for QR code generation.
 * @module
 */

/** QR code error correction levels. */
export type ErrorCorrectionLevelType = "L" | "M" | "Q" | "H";

/** Error correction level constants. */
export const ErrorCorrectionLevel = {
  L: "L",
  M: "M",
  Q: "Q",
  H: "H",
} as const satisfies Record<ErrorCorrectionLevelType, ErrorCorrectionLevelType>;

/** QR code encoding modes. */
export type ModeType = "Numeric" | "AlphaNumeric" | "Byte" | "Kanji";

/** Encoding mode constants. */
export const Mode = {
  Numeric: "Numeric",
  AlphaNumeric: "AlphaNumeric",
  Byte: "Byte",
  Kanji: "Kanji",
} as const satisfies Record<ModeType, ModeType>;

/** Types of reserved bit regions in the QR grid. */
export type ReservedBitsType =
  | "FinderPattern"
  | "AlignmentPattern"
  | "TimingPattern"
  | "FormatInfo"
  | "VersionInfo"
  | "DarkModule"
  | "Separator";

/** Reserved bit type constants. */
export const ReservedBits = {
  FinderPattern: "FinderPattern",
  AlignmentPattern: "AlignmentPattern",
  TimingPattern: "TimingPattern",
  FormatInfo: "FormatInfo",
  VersionInfo: "VersionInfo",
  DarkModule: "DarkModule",
  Separator: "Separator",
} as const satisfies Record<ReservedBitsType, ReservedBitsType>;
