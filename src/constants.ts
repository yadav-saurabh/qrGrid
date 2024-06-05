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
export const ALPHANUMERIC_CHARSET = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  " ",
  "$",
  "%",
  "*",
  "+",
  "-",
  ".",
  "/",
  ":",
];

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
 */
export const MODE_INDICATOR = {
  [Mode.Numeric]: "0001",
  [Mode.AlphaNumeric]: "0010",
  [Mode.Byte]: "0100",
  [Mode.Kanji]: "1000",
};

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

export const INPUT_DATA_CAPACITY = {
  [Mode.Numeric]: {
    [ErrorCorrectionLevel.L]: [
      41, 77, 127, 187, 255, 322, 370, 461, 552, 652, 772, 883, 1022, 1101,
      1250, 1408, 1548, 1725, 1903, 2061, 2232, 2409, 2620, 2812, 3057, 3283,
      3517, 3669, 3909, 4158, 4417, 4686, 4965, 5253, 5529, 5836, 6153, 6479,
      6743, 7089,
    ],
    [ErrorCorrectionLevel.M]: [
      34, 63, 101, 149, 202, 255, 293, 365, 432, 513, 604, 691, 796, 871, 991,
      1082, 1212, 1346, 1500, 1600, 1708, 1872, 2059, 2188, 2395, 2544, 2701,
      2857, 3035, 3289, 3486, 3693, 3909, 4134, 4343, 4588, 4775, 5039, 5313,
      5596,
    ],
    [ErrorCorrectionLevel.Q]: [
      27, 48, 77, 111, 144, 178, 207, 259, 312, 364, 427, 489, 580, 621, 703,
      775, 876, 948, 1063, 1159, 1224, 1358, 1468, 1588, 1718, 1804, 1933, 2085,
      2181, 2358, 2473, 2670, 2805, 2949, 3081, 3244, 3417, 3599, 3791, 3993,
    ],
    [ErrorCorrectionLevel.H]: [
      17, 34, 58, 82, 106, 139, 154, 202, 235, 288, 331, 374, 427, 468, 530,
      602, 674, 746, 813, 919, 969, 1056, 1108, 1228, 1286, 1425, 1501, 1581,
      1677, 1782, 1897, 2022, 2157, 2301, 2361, 2524, 2625, 2735, 2927, 3057,
    ],
  },
  [Mode.AlphaNumeric]: {
    [ErrorCorrectionLevel.L]: [
      25, 47, 77, 114, 154, 195, 224, 279, 335, 395, 468, 535, 619, 667, 758,
      854, 938, 1046, 1153, 1249, 1352, 1460, 1588, 1704, 1853, 1990, 2132,
      2223, 2369, 2520, 2677, 2840, 3009, 3183, 3351, 3537, 3729, 3927, 4087,
      4296,
    ],
    [ErrorCorrectionLevel.M]: [
      20, 38, 61, 90, 122, 154, 178, 221, 262, 311, 366, 419, 483, 528, 600,
      656, 734, 816, 909, 970, 1035, 1134, 1248, 1326, 1451, 1542, 1637, 1732,
      1839, 1994, 2113, 2238, 2369, 2506, 2632, 2780, 2894, 3054, 3220, 3391,
    ],
    [ErrorCorrectionLevel.Q]: [
      16, 29, 47, 67, 87, 108, 125, 157, 189, 221, 259, 296, 352, 376, 426, 470,
      531, 574, 644, 702, 742, 823, 890, 963, 1041, 1094, 1172, 1263, 1322,
      1429, 1499, 1618, 1700, 1787, 1867, 1966, 2071, 2181, 2298, 2420,
    ],
    [ErrorCorrectionLevel.H]: [
      10, 20, 35, 50, 64, 84, 93, 122, 143, 174, 200, 227, 259, 283, 321, 365,
      408, 452, 493, 557, 587, 640, 672, 744, 779, 864, 910, 958, 1016, 1080,
      1150, 1226, 1307, 1394, 1431, 1530, 1591, 1658, 1774, 1852,
    ],
  },
  [Mode.Byte]: {
    [ErrorCorrectionLevel.L]: [
      17, 32, 53, 78, 106, 134, 154, 192, 230, 271, 321, 367, 425, 458, 520,
      586, 644, 718, 792, 858, 929, 1003, 1091, 1171, 1273, 1367, 1465, 1528,
      1628, 1732, 1840, 1952, 2068, 2188, 2303, 2431, 2563, 2699, 2809, 2953,
    ],
    [ErrorCorrectionLevel.M]: [
      14, 26, 42, 62, 84, 106, 122, 152, 180, 213, 251, 287, 331, 362, 412, 450,
      504, 560, 624, 666, 711, 779, 857, 911, 997, 1059, 1125, 1190, 1264, 1370,
      1452, 1538, 1628, 1722, 1809, 1911, 1989, 2099, 2213, 2331,
    ],
    [ErrorCorrectionLevel.Q]: [
      11, 20, 32, 46, 60, 74, 86, 108, 130, 151, 177, 203, 241, 258, 292, 322,
      364, 394, 442, 482, 509, 565, 611, 661, 715, 751, 805, 868, 908, 982,
      1030, 1112, 1168, 1228, 1283, 1351, 1423, 1499, 1579, 1663,
    ],
    [ErrorCorrectionLevel.H]: [
      7, 14, 24, 34, 44, 58, 64, 84, 98, 119, 137, 155, 177, 194, 220, 250, 280,
      310, 338, 382, 403, 439, 461, 511, 535, 593, 625, 658, 698, 742, 790, 842,
      898, 958, 983, 1051, 1093, 1139, 1219, 1273,
    ],
  },
};
