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
  if (data.mode === Mode.Numeric) {
    return (
      MODE_BITS[Mode.Numeric][2] * Math.floor(data.value.length / 3) +
      (data.value.length % 3 ? (data.value.length % 3) * 3 + 1 : 0)
    );
  }
  if (data.mode === Mode.AlphaNumeric) {
    return (
      MODE_BITS[Mode.AlphaNumeric][1] * Math.floor(data.value.length / 2) +
      MODE_BITS[Mode.AlphaNumeric][0] * (data.value.length % 2)
    );
  }
  return data.value.length * MODE_BITS[Mode.Byte][0];
}
