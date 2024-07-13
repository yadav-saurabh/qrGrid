import {
  ALIGNMENT_PATTERN_DIFFS,
  ALIGNMENT_PATTERN_SIZE,
  ALIGNMENT_PATTERN_TOTALS,
  CHARACTER_COUNT_MAX_VERSION,
  CODEWORDS,
  ERROR_CORRECTION_CODEWORDS,
  FINDER_PATTERN_SIZE,
  MODE_BITS,
  MODE_INDICATOR,
  MODE_INDICATOR_BITS,
  PAD_CODEWORDS,
} from "./constants";
import { ErrorCorrectionLevel, Mode } from "./enums";
import { rsEncode } from "./reed-solomon";
import { getSegments } from "./segment";
import {
  getEncodedSegmentData,
  getBitsLength,
  getCapacity,
  getCharCountIndicator,
  getVersionInfoBitString,
} from "./utils";

type PatternSize = typeof FINDER_PATTERN_SIZE | typeof ALIGNMENT_PATTERN_SIZE;
export type Segments = Array<{ value: string; mode: Mode }>;
export type QrOptions = {
  errorCorrection?: keyof typeof ErrorCorrectionLevel;
};

export class QR {
  readonly inputData: string;
  segments: Segments;
  data: Uint8Array;
  noOfModules: number;
  version: number;
  errorCorrection: ErrorCorrectionLevel;
  #codewords: Uint8Array;
  #codeBitLength: number;

  constructor(inputData: string, options?: QrOptions) {
    if (!inputData) {
      throw new Error("Not a valid string input");
    }

    this.#codeBitLength = 0;
    this.inputData = inputData;
    this.errorCorrection =
      ErrorCorrectionLevel[options?.errorCorrection || "M"];

    this.segments = getSegments(inputData);
    this.version = this.#getVersion();
    this.#codewords = new Uint8Array(CODEWORDS[this.version - 1]);
    this.noOfModules = this.version * 4 + 17;

    this.data = new Uint8Array(this.noOfModules * this.noOfModules);

    console.log(this);

    this.#generateCodeword();
    this.#fillFinderPattern();
    this.#fillTimingPattern();
    this.#fillAlignmentPattern();
    if (this.version >= 7) {
      this.#fillVersionInfo();
    }
    this.#fillCodeword();
    this.print();
  }

  #getVersion() {
    let version: number = 0;

    // outer loop character count (CHARACTER_COUNT_INDICATOR length max is 3)
    ccLoop: for (let ccIndex = 0; ccIndex < 3; ccIndex++) {
      const isMixedMode = this.segments.length > 1;
      const mode = isMixedMode ? "Mixed" : this.segments[0].mode;
      const maxCapacityVersion = CHARACTER_COUNT_MAX_VERSION[ccIndex];
      let bitSize: number = isMixedMode ? 0 : this.segments[0].value.length;

      const maxDataCapacity = getCapacity(
        maxCapacityVersion,
        this.errorCorrection,
        mode
      );

      if (isMixedMode) {
        this.segments.forEach((d) => {
          bitSize +=
            MODE_INDICATOR_BITS + MODE_BITS[d.mode][ccIndex] + getBitsLength(d);
        });
      }

      if (bitSize <= maxDataCapacity) {
        let startIndex = CHARACTER_COUNT_MAX_VERSION[ccIndex - 1] - 1 || 1;

        // inner loop qr version
        for (let i = startIndex; i < maxCapacityVersion; i++) {
          const capacity = getCapacity(i, this.errorCorrection, mode);

          if (bitSize <= capacity) {
            version = i;
            break ccLoop;
          }
        }
      }
    }

    return version;
  }

  #encodeCodeword(data: number, bitLen: number) {
    for (let i = 0; i < bitLen; i++) {
      const bit = (data >>> (bitLen - i - 1)) & 1;
      const codewordIndex = Math.floor(this.#codeBitLength / 8);
      if (this.#codewords.length <= codewordIndex) {
        this.#codewords[codewordIndex + 1] = 0;
      }

      if (bit) {
        this.#codewords[codewordIndex] |= 0x80 >>> this.#codeBitLength % 8;
      }
      this.#codeBitLength++;
    }
  }

  #generateCodeword() {
    for (let index = 0; index < this.segments.length; index++) {
      const segment = this.segments[index];
      // encode mode
      this.#encodeCodeword(MODE_INDICATOR[segment.mode], MODE_INDICATOR_BITS);
      // encode character count indicator
      this.#encodeCodeword(
        segment.value.length,
        getCharCountIndicator(segment.mode, this.version)
      );
      // encode segment data
      const segmentBitArray = getEncodedSegmentData(segment);
      for (let i = 0; i < segmentBitArray.length; i++) {
        const segmentBit = segmentBitArray[i];
        this.#encodeCodeword(segmentBit.data, segmentBit.bitLength);
      }
    }
    const totalCodeword = CODEWORDS[this.version - 1];
    const ecTotalCodeword =
      ERROR_CORRECTION_CODEWORDS[this.errorCorrection][this.version - 1];

    const dataTotalCodeword = totalCodeword - ecTotalCodeword;
    const dataTotalCodewordBits = dataTotalCodeword * 8;

    if (this.#codeBitLength + 4 <= dataTotalCodewordBits) {
      this.#encodeCodeword(0, 4);
    }

    if (this.#codeBitLength % 8 !== 0) {
      this.#encodeCodeword(0, this.#codeBitLength % 8);
    }

    const remainingByte = (dataTotalCodewordBits - this.#codeBitLength) / 8;
    for (let i = 0; i < remainingByte; i++) {
      this.#encodeCodeword(PAD_CODEWORDS[i % 2], 8);
    }

    const ecCodeWord = rsEncode(this.#codewords, ecTotalCodeword);
    for (let i = 0; i < ecTotalCodeword; i++) {
      this.#codewords[i + dataTotalCodeword] = ecCodeWord[i];
    }
  }

  #fillBlock(x: number, y: number, size: PatternSize) {
    const height = size + x - 1;
    const width = size + y - 1;
    for (let i = x; i <= height; i++) {
      for (let j = y; j <= width; j++) {
        const index = i * this.noOfModules + j;
        // outer block
        if (j === y || j === width) {
          this.data[index] = 1;
        }
        if (i === x || i === height) {
          this.data[index] = 1;
        }
        // inner block
        if (j >= y + 2 && j <= width - 2 && i >= x + 2 && i <= height - 2) {
          this.data[index] = 1;
        }
      }
    }
  }

  // fill timingPattern with 1
  #fillTimingPattern() {
    let length = this.noOfModules - FINDER_PATTERN_SIZE * 2 - 2;
    for (let i = 1; i <= length; i = i + 2) {
      const hIndex = FINDER_PATTERN_SIZE + i + this.noOfModules * 6;
      const vIndex = (FINDER_PATTERN_SIZE + i) * this.noOfModules + 6;

      this.data[hIndex] = 1;
      this.data[vIndex] = 1;
    }
  }

  // fill finderPattern
  #fillFinderPattern() {
    // top-left finder pattern
    this.#fillBlock(0, 0, FINDER_PATTERN_SIZE);
    // top-right finder pattern
    this.#fillBlock(
      0,
      this.noOfModules - FINDER_PATTERN_SIZE,
      FINDER_PATTERN_SIZE
    );
    // bottom-left finder pattern
    this.#fillBlock(
      this.noOfModules - FINDER_PATTERN_SIZE,
      0,
      FINDER_PATTERN_SIZE
    );
  }

  // fill alignmentPattern
  #fillAlignmentPattern() {
    if (this.version === 1) {
      return;
    }

    const subdivisionCount = Math.floor(this.version / 7);
    const total = ALIGNMENT_PATTERN_TOTALS[subdivisionCount];
    const first = 6;
    const last = this.noOfModules - 7;
    const diff = ALIGNMENT_PATTERN_DIFFS[this.version - 1];
    const positions = [first];
    for (let i = subdivisionCount; i >= 1; i--) {
      positions.push(last - i * diff);
    }
    positions.push(last);

    let xIndex = 0;
    let yIndex = 1;
    for (let index = 0; index < total; index++) {
      if (yIndex === positions.length) {
        xIndex++;
        yIndex = 0;
      }
      if (positions[xIndex] === first && positions[yIndex] === last) {
        xIndex++;
        yIndex = 0;
      }
      if (positions[xIndex] === last && positions[yIndex] === first) {
        yIndex++;
      }
      const x = positions[xIndex];
      const y = positions[yIndex];
      this.#fillBlock(x - 2, y - 2, ALIGNMENT_PATTERN_SIZE);
      yIndex++;
    }
  }

  #fillVersionInfo() {
    const bits = getVersionInfoBitString(this.version);
    for (let i = 0; i < 18; i++) {
      const bit = bits[i];
      const row = Math.floor(i / 3);
      const col = this.noOfModules - 11 + (i % 3);
      // Encode in top-right corner
      this.data[row * this.noOfModules + col] = +bit;
      // Encode in bottom-left corner
      this.data[col * this.noOfModules + row] = +bit;
    }
  }

  #fillCodeword() {}

  print() {
    for (let i = 0; i < this.noOfModules; i++) {
      for (let j = 0; j < this.noOfModules; j++) {
        const index = i * this.noOfModules + j;
        if (this.data[index] === 1) {
          process.stdout.write("██");
          // process.stdout.write("1 ");
          continue;
        }
        process.stdout.write("  ");
      }
      process.stdout.write("\n");
    }
  }
}
