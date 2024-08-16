/**
 * This module contains utility function used to generate a qr.
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
import { Segments } from "./segment.js";

/**
 * special characters used in Alpha Numeric character in QR
 */
const ALPHANUMERIC_SPECIAL_CHARSET = " $%*+\\-./:";

/**
 * basic regex string for Numeric | Alphanumeric and Byte selection
 */
export const regexString = {
  [Mode.Numeric]: "[0-9]+",
  [Mode.AlphaNumeric]: `[A-Z${ALPHANUMERIC_SPECIAL_CHARSET}]+`,
  [Mode.Byte]: `[^A-Z0-9${ALPHANUMERIC_SPECIAL_CHARSET}]+`,
};

/**
 * get the bit length for the given segment
 */
export function getBitsLength(data: Segments[0]) {
  const dataLength = data.value.length;
  if (data.mode === Mode.Numeric) {
    const maxModeBit = MODE_BITS[Mode.Numeric][2];
    const modeLength = MODE_BITS[Mode.Numeric].length;
    return (
      maxModeBit * Math.floor(dataLength / modeLength) +
      (dataLength % modeLength ? (dataLength % modeLength) * modeLength + 1 : 0)
    );
  }
  if (data.mode === Mode.AlphaNumeric) {
    const [firstBit, secondBit] = MODE_BITS[Mode.AlphaNumeric];
    const modeLength = MODE_BITS[Mode.AlphaNumeric].length;
    return (
      secondBit * Math.floor(dataLength / modeLength) +
      firstBit * (dataLength % modeLength)
    );
  }
  return new TextEncoder().encode(data.value).length * MODE_BITS[Mode.Byte][0];
}

/**
 * get the bit of character count indicator
 */
export function getCharCountIndicator(mode: ModeType, version: number) {
  let index = 0;
  if (version > 26) {
    index = 2;
  } else if (version > 9) {
    index = 1;
  }
  return CHARACTER_COUNT_INDICATOR[mode][index];
}

/**
 * get the version info bit
 */
export function getVersionInfoBits(version: number) {
  // Golay code generator polynomial 0x1F25 (0b1111100100101)
  const GOLAY_GENERATOR = 0x1f25;

  // The 6 bits representing the version number
  let versionBits = version << 12;

  // Calculate the error correction bits
  let dividend = versionBits;
  for (let i = 17; i >= 12; i--) {
    if (dividend & (1 << i)) {
      dividend ^= GOLAY_GENERATOR << (i - 12);
    }
  }

  // Combine version and error correction bits
  return versionBits | (dividend & 0xfff);
}

/**
 * get the format info bit
 */
export function getFormatInfoBits(
  errorCorrectionBit: number,
  maskPattern: number
) {
  // Golay Generator polynomial for QR code format information
  const GOLAY_GENERATOR = 0x537;

  // XOR mask for format information
  const FORMAT_MASK = 0x5412;

  let formatInfo = (errorCorrectionBit << 3) | maskPattern;
  let reg = formatInfo << 10;

  // Calculate error correction bits
  for (let i = 4; i >= 0; i--) {
    if (reg & (1 << (i + 10))) {
      reg ^= GOLAY_GENERATOR << i;
    }
  }
  let errorCorrectionBits = reg & 0x3ff;

  // Combine format info with error correction bits
  let pattern = (formatInfo << 10) | errorCorrectionBits;

  // XOR with the format mask
  return (pattern ^= FORMAT_MASK);
}

/**
 * get the capacity
 */
export function getCapacity(
  version: number,
  errorCorrectionLevel: ErrorCorrectionLevelType,
  mode: ModeType | "Mixed"
) {
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
    case Mode.Numeric: {
      return Math.floor((usableBits / 10) * 3);
    }
    case Mode.AlphaNumeric: {
      return Math.floor((usableBits / 11) * 2);
    }
    case Mode.Kanji: {
      return Math.floor(usableBits / 13);
    }
    case Mode.Byte: {
      return Math.floor(usableBits / 8);
    }
  }
  return 0;
}

/**
 * get the encoded value of a segment for the given mode
 */
export function getEncodedSegmentData(data: Segments[0]) {
  let bitArray: { data: number; bitLength: number }[] = [];
  const { value, mode } = data;

  if (mode === Mode.Numeric) {
    for (let i = 0; i < value.length; i = i + 3) {
      const first = value[i];
      const second = value[i + 1] || null;
      const third = value[i + 2] || null;
      if (third !== null) {
        let num = Number(first + second + third);
        bitArray.push({ data: num, bitLength: MODE_BITS[Mode.Numeric][2] });
      } else if (second !== null) {
        let num = Number(first + second);
        bitArray.push({ data: num, bitLength: MODE_BITS[Mode.Numeric][1] });
      } else {
        let num = Number(first);
        bitArray.push({ data: num, bitLength: MODE_BITS[Mode.Numeric][0] });
      }
    }
    return bitArray;
  }
  if (mode === Mode.AlphaNumeric) {
    for (let i = 0; i < value.length; i = i + 2) {
      const first = ALPHANUMERIC_CHARSET.indexOf(value[i]);
      const second = value[i + 1]
        ? ALPHANUMERIC_CHARSET.indexOf(value[i + 1])
        : null;
      if (second !== null) {
        const num = first * 45 + second;
        const bitLength = MODE_BITS[Mode.AlphaNumeric][1];
        bitArray.push({ data: num, bitLength });
      } else {
        const num = first;
        const bitLength = MODE_BITS[Mode.AlphaNumeric][0];
        bitArray.push({ data: num, bitLength });
      }
    }
    return bitArray;
  }
  if (mode === Mode.Byte) {
    const encodedData = new TextEncoder().encode(value);
    for (let i = 0; i < encodedData.length; i++) {
      let num = encodedData[i];
      bitArray.push({ data: num, bitLength: MODE_BITS[Mode.Byte][0] });
    }
  }
  return bitArray;
}

/**
 * get mask penalty
 */
export function getMaskPenalty(data: Uint8Array, size: number): number {
  let penalty = 0;

  // Rule 1: Five or more same-colored modules in a row
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
        if (rowCount >= 5) rowPenalty += 3 + (rowCount - 5);
        rowCount = 1;
        lastRowBit = rowBit;
      }

      const colBit = data[j * size + i];
      if (colBit === lastColBit) {
        colCount++;
      } else {
        if (colCount >= 5) colPenalty += 3 + (colCount - 5);
        colCount = 1;
        lastColBit = colBit;
      }
    }

    if (rowCount >= 5) rowPenalty += 3 + (rowCount - 5);
    if (colCount >= 5) colPenalty += 3 + (colCount - 5);

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
        penalty += 3;
      }
    }
  }

  // Rule 3: Specific patterns in rows or columns
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

      if (matchRow1 || matchRow2) penalty += 40;
      if (matchCol1 || matchCol2) penalty += 40;
    }
  }

  // Rule 4: Balance of dark and light modules
  const darkModules = data.reduce((sum, bit) => sum + bit, 0);
  const totalModules = data.length;
  const darkPercentage = (darkModules * 100) / totalModules;
  const previousMultiple = Math.floor(darkPercentage / 5) * 5;
  const nextMultiple = Math.ceil(darkPercentage / 5) * 5;
  penalty +=
    Math.min(
      Math.abs(previousMultiple - 50) / 5,
      Math.abs(nextMultiple - 50) / 5
    ) * 10;

  return penalty;
}
