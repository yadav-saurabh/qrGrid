import { Segments } from "./qr";
import { MODE_BITS } from "./constants";
import { Mode } from "./enums";

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
