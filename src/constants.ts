import { ErrorCorrectionLevel, Mode } from "./enums";

/**
 * Alphanumeric mode character set
 * - 0 : 0
 * - 1 : 1
 * - ...
 * - A : 10
 * - B : 11
 * - ...
 */
export const ALPHANUMERIC_CHARSET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";

/**
 * No of modules for outer dark square of Finder Pattern: `7 x 7`
 */
export const FINDER_PATTERN_SIZE = 7;

/**
 * No of modules for outer dark square of Alignment Pattern: `5 x 5`
 */
export const ALIGNMENT_PATTERN_SIZE = 5;

/**
 * No of alignment patterns for a given QR version
 * - v 01-06   : index 0
 * - v 07-13  : index 1
 * - v 14-20 : index 2
 * - ...
 * @example // to get the value of a specific version
 * index = floor(version / 7)
 * ALIGNMENT_PATTERN_TOTALS[index]
 */
export const ALIGNMENT_PATTERN_TOTALS = [1, 6, 13, 22, 33, 46];

/**
 * ALIGNMENT_PATTERN_DIFFS
 */
export const ALIGNMENT_PATTERN_DIFFS = [
  0, 12, 16, 20, 24, 28, 16, 18, 20, 22, 24, 26, 28, 20, 22, 24, 24, 26, 28, 28,
  22, 24, 24, 26, 26, 28, 28, 24, 24, 26, 26, 26, 28, 28, 24, 26, 26, 26, 28,
  28,
];

/**
 * Mode Indicator Total `4 bits`
 */
export const MODE_INDICATOR_BITS = 4;

/**
 * Mode Indicator values for different modes
 * - Numeric:       0001 (0x1)
 * - AlphaNumeric:  0010 (0x2)
 * - Byte:          0100 (0x4)
 * - Kanji:         1000 (0x8)
 */
export const MODE_INDICATOR = {
  [Mode.Numeric]: 0b0001,
  [Mode.AlphaNumeric]: 0b0010,
  [Mode.Byte]: 0b0100,
  [Mode.Kanji]: 0b1000,
};

/**
 * get version range of the qr based on the character count
 * - index 0 : v < 9
 * - index 1 : v < 26
 * - index 2 : v < 40
 */
export const CHARACTER_COUNT_MAX_VERSION = [9, 26, 40];

/**
 * Number of bits in Character Count Indicator for different mode and Qr version
 * - v 01-09 : index 0
 * - v 10-26 : index 1
 * - v 27-40 : index 2
 * @example // to get the value of a specific mode and version
 * index = 0
 * if version > 9
 *   index = 1
 * else if version > 26
 *   index = 2
 * CHARACTER_COUNT_INDICATOR[Mode][index]
 */
export const CHARACTER_COUNT_INDICATOR = {
  [Mode.Numeric]: [10, 12, 14],
  [Mode.AlphaNumeric]: [9, 11, 13],
  [Mode.Byte]: [8, 16, 16],
  [Mode.Kanji]: [8, 10, 12],
};

/**
 * Number of bits for a mode
 * - Numeric      : 10 bits 3 character
 * - AlphaNumeric : 11 bits 2 character
 * - Byte         : 8 bits per character
 * - Kanji        : 13 bits per character
 */
export const MODE_BITS = {
  [Mode.Numeric]: [4, 7, 10],
  [Mode.AlphaNumeric]: [6, 11],
  [Mode.Byte]: [8],
  [Mode.Kanji]: [13],
};

/**
 * Pad Codewords
 * - 11101100 (0xEC) : index 0
 * - 00010001 (0x11) : index 1
 */
export const PAD_CODEWORDS = [0xEC, 0x11];

/**
 * Number of data Codewords for Qr version
 * - v 1 : index 0
 * - v 2 : index 1
 * - v 3 : index 2
 * - ...
 * @example // to get the value of a specific version
 *   index = version - 1
 *   codewords = CODEWORDS[index]
 */
export const CODEWORDS = [
  26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733,
  815, 901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051,
  2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706,
];

/**
 * Number of data Codewords for different error correction level and Qr version
 * @example // to get the value of a specific mode and version
 *   index = version - 1
 *   errorCorrectionLevel = ErrorCorrectionLevel.M
 *   errorCOrrectionBlock = ERROR_CORRECTION_BLOCK[errorCorrectionLevel][index]
 */
export const ERROR_CORRECTION_CODEWORDS = {
  [ErrorCorrectionLevel.L]: [
    7, 10, 15, 20, 26, 36, 40, 48, 60, 72, 80, 96, 104, 120, 132, 144, 168, 180,
    196, 224, 224, 252, 270, 300, 312, 336, 360, 390, 420, 450, 480, 510, 540,
    570, 570, 600, 630, 660, 720, 750,
  ],
  [ErrorCorrectionLevel.M]: [
    10, 16, 26, 36, 48, 64, 72, 88, 110, 130, 150, 176, 198, 216, 240, 280, 308,
    338, 364, 416, 442, 476, 504, 560, 588, 644, 700, 728, 784, 812, 868, 924,
    980, 1036, 1064, 1120, 1204, 1260, 1316, 1372,
  ],
  [ErrorCorrectionLevel.Q]: [
    13, 22, 36, 52, 72, 96, 108, 132, 160, 192, 224, 260, 288, 320, 360, 408,
    448, 504, 546, 600, 644, 690, 750, 810, 870, 952, 1020, 1050, 1140, 1200,
    1290, 1350, 1440, 1530, 1590, 1680, 1770, 1860, 1950, 2040,
  ],
  [ErrorCorrectionLevel.H]: [
    17, 28, 44, 64, 88, 112, 130, 156, 192, 224, 264, 308, 352, 384, 432, 480,
    532, 588, 650, 700, 750, 816, 900, 960, 1050, 1110, 1200, 1260, 1350, 1440,
    1530, 1620, 1710, 1800, 1890, 1980, 2100, 2220, 2310, 2430,
  ],
};

/**
 * Number of data Codewords for different error correction level and version
 * @example // to get the value of a specific mode and version
 *   index = version - 1
 *   errorCorrectionLevel = ErrorCorrectionLevel.M
 *   errorCOrrectionBlock = ERROR_CORRECTION_BLOCK[errorCorrectionLevel][index]
 */
export const ERROR_CORRECTION_BLOCK = {
  [ErrorCorrectionLevel.L]: [
    1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12,
    12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25,
  ],
  [ErrorCorrectionLevel.M]: [
    1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17,
    18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49,
  ],
  [ErrorCorrectionLevel.Q]: [
    1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23,
    25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68,
  ],
  [ErrorCorrectionLevel.H]: [
    1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25,
    34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81,
  ],
};
