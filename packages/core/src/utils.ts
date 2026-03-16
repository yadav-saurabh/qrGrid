/**
 * Utility functions for QR code generation.
 * @module
 */
import {
  ALPHANUMERIC_CHARSET,
  CHARACTER_COUNT_INDICATOR,
  CODEWORDS,
  ERROR_CORRECTION_CODEWORDS,
  MODE_BITS,
  MODE_INDICATOR_BITS,
} from "./constants.js";
import { ErrorCorrectionLevelType, Mode, ModeType } from "./enums.js";
import type { Segment } from "./segment.js";

/** Special characters used in AlphaNumeric mode (escaped for regex). */
const ALPHANUMERIC_SPECIAL_CHARSET = " $%*+\\-./:";

/** Multiplier for AlphaNumeric mode: first char value * 45 + second char value. */
const ALPHANUMERIC_MULTIPLIER = 45;

// ── Mask penalty rule constants ──────────────────────────────────────────────

/** Minimum consecutive same-color modules to trigger Rule 1 penalty. */
const PENALTY_RULE1_MIN_RUN = 5;

/** Base penalty for Rule 1 (5+ consecutive same-color modules in a row/column). */
const PENALTY_RULE1_BASE = 3;

/** Penalty for each 2x2 block of same-color modules (Rule 2). */
const PENALTY_RULE2_BLOCK = 3;

/** Penalty for finder-like patterns in data area (Rule 3). */
const PENALTY_RULE3_PATTERN = 40;

/** Penalty multiplier for dark/light module balance deviation (Rule 4). */
const PENALTY_RULE4_MULTIPLIER = 10;

/** Step size for percentage calculation in Rule 4. */
const PENALTY_RULE4_STEP = 5;

/** Target dark module percentage for Rule 4. */
const PENALTY_RULE4_TARGET = 50;

/** Encoded bit entry: a numeric value and its bit width. */
export interface EncodedBit {
  data: number;
  bitLength: number;
}

/**
 * Regex patterns for splitting input into basic encoding modes.
 *
 * - Numeric: consecutive digits
 * - AlphaNumeric: uppercase letters and special characters
 * - Byte: everything else
 */
export const regexString = {
  [Mode.Numeric]: "[0-9]+",
  [Mode.AlphaNumeric]: `[A-Z${ALPHANUMERIC_SPECIAL_CHARSET}]+`,
  [Mode.Byte]: `[^A-Z0-9${ALPHANUMERIC_SPECIAL_CHARSET}]+`,
} as const;

/**
 * Calculates the total bit length required to encode a segment's data.
 *
 * @param segment - The segment to measure.
 * @returns Total bits needed to encode the segment value.
 */
export function getBitsLength(segment: Segment): number {
  const dataLength = segment.value.length;

  if (segment.mode === Mode.Numeric) {
    const maxModeBit = MODE_BITS[Mode.Numeric][2];
    const modeLength = MODE_BITS[Mode.Numeric].length;
    return (
      maxModeBit * Math.floor(dataLength / modeLength) +
      (dataLength % modeLength ? (dataLength % modeLength) * modeLength + 1 : 0)
    );
  }

  if (segment.mode === Mode.AlphaNumeric) {
    const [firstBit, secondBit] = MODE_BITS[Mode.AlphaNumeric];
    const modeLength = MODE_BITS[Mode.AlphaNumeric].length;
    return (
      secondBit * Math.floor(dataLength / modeLength) +
      firstBit * (dataLength % modeLength)
    );
  }

  return (
    new TextEncoder().encode(segment.value).length * MODE_BITS[Mode.Byte][0]
  );
}

/**
 * Returns the character count indicator bit length for a given mode and version.
 *
 * @param mode - Encoding mode.
 * @param version - QR version (1-40).
 * @returns Number of bits used for the character count indicator.
 */
export function getCharCountIndicator(mode: ModeType, version: number): number {
  let index = 0;
  if (version > 26) {
    index = 2;
  } else if (version > 9) {
    index = 1;
  }
  return CHARACTER_COUNT_INDICATOR[mode][index];
}

/**
 * Generates the 18-bit version information bitstring using Golay error correction.
 *
 * Only applicable for versions >= 7.
 *
 * @param version - QR version (7-40).
 * @returns 18-bit version information value.
 */
export function getVersionInfoBits(version: number): number {
  // Golay code generator polynomial: 0x1F25 (0b1111100100101)
  const GOLAY_GENERATOR = 0x1f25;
  const versionBits = version << 12;

  // Calculate the error correction bits via polynomial division
  let dividend = versionBits;
  for (let i = 17; i >= 12; i--) {
    if (dividend & (1 << i)) {
      dividend ^= GOLAY_GENERATOR << (i - 12);
    }
  }

  return versionBits | (dividend & 0xfff);
}

/**
 * Generates the 15-bit format information bitstring.
 *
 * @param errorCorrectionBit - 2-bit error correction level indicator.
 * @param maskPattern - Mask pattern index (0-7).
 * @returns 15-bit format information value (XOR-masked).
 */
export function getFormatInfoBits(
  errorCorrectionBit: number,
  maskPattern: number,
): number {
  // Golay generator polynomial for QR format information
  const GOLAY_GENERATOR = 0x537;
  // XOR mask applied to final format information
  const FORMAT_MASK = 0x5412;

  const formatInfo = (errorCorrectionBit << 3) | maskPattern;
  let reg = formatInfo << 10;

  // Calculate error correction bits via polynomial division
  for (let i = 4; i >= 0; i--) {
    if (reg & (1 << (i + 10))) {
      reg ^= GOLAY_GENERATOR << i;
    }
  }
  const errorCorrectionBits = reg & 0x3ff;

  // Combine format info with error correction bits and apply mask
  const pattern = (formatInfo << 10) | errorCorrectionBits;
  return pattern ^ FORMAT_MASK;
}

/**
 * Returns the data capacity for a given version, error correction level, and mode.
 *
 * For "Mixed" mode, returns the raw data bit capacity (no mode/character count overhead).
 *
 * @param version - QR version (1-40).
 * @param errorCorrectionLevel - Error correction level.
 * @param mode - Encoding mode, or "Mixed" for raw bit capacity.
 * @returns Maximum number of characters (or bits for "Mixed" mode).
 */
export function getCapacity(
  version: number,
  errorCorrectionLevel: ErrorCorrectionLevelType,
  mode: ModeType | "Mixed",
): number {
  const totalCodeWord = CODEWORDS[version - 1];
  const ecTotalCodeWord =
    ERROR_CORRECTION_CODEWORDS[errorCorrectionLevel][version - 1];
  const dataTotalCodewordsBits = (totalCodeWord - ecTotalCodeWord) * 8;

  if (mode === "Mixed") {
    return dataTotalCodewordsBits;
  }

  const usableBits =
    dataTotalCodewordsBits -
    (getCharCountIndicator(mode, version) + MODE_INDICATOR_BITS);

  switch (mode) {
    case Mode.Numeric:
      return Math.floor((usableBits / 10) * 3);
    case Mode.AlphaNumeric:
      return Math.floor((usableBits / 11) * 2);
    case Mode.Kanji:
      return Math.floor(usableBits / 13);
    case Mode.Byte:
      return Math.floor(usableBits / 8);
  }
}

/**
 * Encodes a segment's value into an array of bit entries according to its mode.
 *
 * @param segment - The segment to encode.
 * @returns Array of encoded bit entries.
 */
export function getEncodedSegmentData(segment: Segment): EncodedBit[] {
  const bitArray: EncodedBit[] = [];
  const { value, mode } = segment;

  if (mode === Mode.Numeric) {
    for (let i = 0; i < value.length; i += 3) {
      const first = value[i];
      const second = value[i + 1] ?? null;
      const third = value[i + 2] ?? null;

      if (third !== null) {
        const num = Number(first + second + third);
        bitArray.push({ data: num, bitLength: MODE_BITS[Mode.Numeric][2] });
      } else if (second !== null) {
        const num = Number(first + second);
        bitArray.push({ data: num, bitLength: MODE_BITS[Mode.Numeric][1] });
      } else {
        const num = Number(first);
        bitArray.push({ data: num, bitLength: MODE_BITS[Mode.Numeric][0] });
      }
    }
    return bitArray;
  }

  if (mode === Mode.AlphaNumeric) {
    for (let i = 0; i < value.length; i += 2) {
      const first = ALPHANUMERIC_CHARSET.indexOf(value[i]);
      const second = value[i + 1]
        ? ALPHANUMERIC_CHARSET.indexOf(value[i + 1])
        : null;

      if (second !== null) {
        const num = first * ALPHANUMERIC_MULTIPLIER + second;
        bitArray.push({
          data: num,
          bitLength: MODE_BITS[Mode.AlphaNumeric][1],
        });
      } else {
        bitArray.push({
          data: first,
          bitLength: MODE_BITS[Mode.AlphaNumeric][0],
        });
      }
    }
    return bitArray;
  }

  if (mode === Mode.Byte) {
    const encodedData = new TextEncoder().encode(value);
    for (let i = 0; i < encodedData.length; i++) {
      bitArray.push({
        data: encodedData[i],
        bitLength: MODE_BITS[Mode.Byte][0],
      });
    }
  }

  return bitArray;
}

/**
 * Calculates the total mask penalty score for a QR data grid.
 *
 * Applies all four QR specification penalty rules:
 * 1. Five or more consecutive same-colored modules in a row/column
 * 2. 2x2 blocks of same-colored modules
 * 3. Finder-like patterns (1011101) in data area
 * 4. Deviation from 50% dark module balance
 *
 * @param data - Flat QR grid data (1 = dark, 0 = light).
 * @param size - Grid dimension (modules per side).
 * @returns Total penalty score.
 */
export function getMaskPenalty(data: Uint8Array, size: number): number {
  let penalty = 0;

  // Rule 1: Five or more same-colored modules in a row/column
  for (let i = 0; i < size; i++) {
    let rowPenalty = 0;
    let colPenalty = 0;
    let lastRowBit = data[i * size];
    let lastColBit = data[i];
    let rowCount = 0;
    let colCount = 0;

    for (let j = 0; j < size; j++) {
      const rowBit = data[i * size + j];
      if (rowBit === lastRowBit) {
        rowCount++;
      } else {
        if (rowCount >= PENALTY_RULE1_MIN_RUN) {
          rowPenalty += PENALTY_RULE1_BASE + (rowCount - PENALTY_RULE1_MIN_RUN);
        }
        rowCount = 1;
        lastRowBit = rowBit;
      }

      const colBit = data[j * size + i];
      if (colBit === lastColBit) {
        colCount++;
      } else {
        if (colCount >= PENALTY_RULE1_MIN_RUN) {
          colPenalty += PENALTY_RULE1_BASE + (colCount - PENALTY_RULE1_MIN_RUN);
        }
        colCount = 1;
        lastColBit = colBit;
      }
    }

    if (rowCount >= PENALTY_RULE1_MIN_RUN) {
      rowPenalty += PENALTY_RULE1_BASE + (rowCount - PENALTY_RULE1_MIN_RUN);
    }
    if (colCount >= PENALTY_RULE1_MIN_RUN) {
      colPenalty += PENALTY_RULE1_BASE + (colCount - PENALTY_RULE1_MIN_RUN);
    }

    penalty += rowPenalty + colPenalty;
  }

  // Rule 2: 2x2 blocks of same-colored modules
  for (let i = 0; i < size - 1; i++) {
    for (let j = 0; j < size - 1; j++) {
      const color = data[i * size + j];
      if (
        color === data[(i + 1) * size + j] &&
        color === data[i * size + (j + 1)] &&
        color === data[(i + 1) * size + (j + 1)]
      ) {
        penalty += PENALTY_RULE2_BLOCK;
      }
    }
  }

  // Rule 3: Finder-like patterns in rows/columns
  const pattern1 = new Uint8Array([1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0]);
  const pattern2 = new Uint8Array([0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1]);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= size - pattern1.length; j++) {
      let matchRow1 = true;
      let matchRow2 = true;
      let matchCol1 = true;
      let matchCol2 = true;

      for (let k = 0; k < pattern1.length; k++) {
        if (data[i * size + j + k] !== pattern1[k]) matchRow1 = false;
        if (data[i * size + j + k] !== pattern2[k]) matchRow2 = false;
        if (data[(j + k) * size + i] !== pattern1[k]) matchCol1 = false;
        if (data[(j + k) * size + i] !== pattern2[k]) matchCol2 = false;
      }

      if (matchRow1 || matchRow2) penalty += PENALTY_RULE3_PATTERN;
      if (matchCol1 || matchCol2) penalty += PENALTY_RULE3_PATTERN;
    }
  }

  // Rule 4: Dark/light module balance
  const darkModules = data.reduce((sum, bit) => sum + bit, 0);
  const totalModules = data.length;
  const darkPercentage = (darkModules * 100) / totalModules;
  const previousMultiple =
    Math.floor(darkPercentage / PENALTY_RULE4_STEP) * PENALTY_RULE4_STEP;
  const nextMultiple =
    Math.ceil(darkPercentage / PENALTY_RULE4_STEP) * PENALTY_RULE4_STEP;
  penalty +=
    Math.min(
      Math.abs(previousMultiple - PENALTY_RULE4_TARGET) / PENALTY_RULE4_STEP,
      Math.abs(nextMultiple - PENALTY_RULE4_TARGET) / PENALTY_RULE4_STEP,
    ) * PENALTY_RULE4_MULTIPLIER;

  return penalty;
}
