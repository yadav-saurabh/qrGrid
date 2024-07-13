import { Segments } from "./qr";
import {
  ALPHANUMERIC_CHARSET,
  CHARACTER_COUNT_INDICATOR,
  CODEWORDS,
  ERROR_CORRECTION_CODEWORDS,
  MODE_BITS,
  MODE_INDICATOR_BITS,
} from "./constants";
import { ErrorCorrectionLevel, Mode } from "./enums";

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
    const leastModeBit = MODE_BITS[Mode.Numeric][0];
    const modeLength = MODE_BITS[Mode.Numeric].length;
    return (
      leastModeBit * Math.floor(dataLength / modeLength) +
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
  return dataLength * MODE_BITS[Mode.Byte][0];
}

/**
 * get the bit of character count indicator
 */
export function getCharCountIndicator(mode: Mode, version: number) {
  let index = 0;
  if (version > 9) {
    index = 1;
  } else if (version > 26) {
    index = 2;
  }
  return CHARACTER_COUNT_INDICATOR[mode][index];
}

/**
 * get the version info bit string
 */
export function getVersionInfoBitString(version: number) {
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
  let result = versionBits | (dividend & 0xfff);
  return result.toString(2).padStart(18, "0");
}

/**
 * get the capacity
 */
export function getCapacity(
  version: number,
  errorCorrectionLevel: ErrorCorrectionLevel,
  mode: Mode | "Mixed"
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
        ? ALPHANUMERIC_CHARSET.indexOf(value[i])
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
    for (let i = 0; i < value.length; i++) {
      let num = value.charCodeAt(i);
      bitArray.push({ data: num, bitLength: MODE_BITS[Mode.Byte][0] });
    }
  }
  return bitArray;
}
