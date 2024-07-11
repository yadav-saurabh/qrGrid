import {
  ALIGNMENT_PATTERN_DIFFS,
  ALIGNMENT_PATTERN_SIZE,
  ALIGNMENT_PATTERN_TOTALS,
  CHARACTER_COUNT_MAX_VERSION,
  CODEWORDS,
  ERROR_CORRECTION_BLOCK,
  ERROR_CORRECTION_CODEWORDS,
  FINDER_PATTERN_SIZE,
  INPUT_DATA_CAPACITY,
  MODE_BITS,
  MODE_INDICATOR,
  MODE_INDICATOR_BITS,
  PAD_CODEWORDS,
} from "./constants";
import { ErrorCorrectionLevel, Mode } from "./enums";
import { rsEncode } from "./reed-solomon";
import { getSegments } from "./segment";
import {
  getBinaryString,
  getBitsLength,
  getCharacterCountIndicator,
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
  // private codeWord: Uint8Array;

  constructor(inputData: string, options?: QrOptions) {
    if (!inputData) {
      throw new Error("Not a valid string input");
    }

    this.inputData = inputData;
    this.errorCorrection =
      ErrorCorrectionLevel[options?.errorCorrection || "M"];

    this.segments = getSegments(inputData);
    this.version = this.getVersion();
    this.noOfModules = this.version * 4 + 17;

    this.data = new Uint8Array(this.noOfModules * this.noOfModules);
    // this.codeWord = new Uint8Array();

    console.log(this);

    this.encodeData();
    this.fillFinderPattern();
    this.fillTimingPattern();
    this.fillAlignmentPattern();
    this.print();
  }

  private encodeData() {
    let bitString = "";

    for (let index = 0; index < this.segments.length; index++) {
      const segment = this.segments[index];
      const miBitString = MODE_INDICATOR[segment.mode];
      const _pad = getCharacterCountIndicator(segment.mode, this.version);
      const ccBitString = this.inputData.length.toString(2).padStart(_pad, "0");
      const segBitString = getBinaryString(segment);
      bitString += miBitString + ccBitString + segBitString.join("");
    }
    const totalCodeWord = CODEWORDS[this.version - 1];
    const ecTotalCodeWordIndex =
      (this.version - 1) * 4 +
      Object.values(ErrorCorrectionLevel).indexOf(this.errorCorrection);
    const ecTotalCodeWord = ERROR_CORRECTION_CODEWORDS[ecTotalCodeWordIndex];

    const dataTotalCodewords = totalCodeWord - ecTotalCodeWord;
    const dataTotalCodewordsBits = dataTotalCodewords * 8;

    if (bitString.length + 4 <= dataTotalCodewordsBits) {
      bitString += "0000";
    }

    while (bitString.length % 8 !== 0) {
      bitString += "0";
    }

    const codeWord: number[] = [];
    for (let i = 0; i < bitString.length; i += 8) {
      codeWord.push(parseInt(bitString.slice(i, i + 8), 2));
    }

    const remainingByte = (dataTotalCodewordsBits - bitString.length) / 8;
    for (let i = 0; i < remainingByte; i++) {
      codeWord.push(PAD_CODEWORDS[i % 2]);
    }

    const ecCodeWord = rsEncode(codeWord, ecTotalCodeWord);
    console.log({ codeWord, ecCodeWord });
  }

  private getVersion() {
    let version: number = 0;

    // outer loop character count (CHARACTER_COUNT_INDICATOR length max is 3)
    ccLoop: for (let ccIndex = 0; ccIndex < 3; ccIndex++) {
      const isMixedMode = this.segments.length > 1;
      const mode = isMixedMode ? Mode.Byte : this.segments[0].mode;
      const capacityArray = INPUT_DATA_CAPACITY[mode][this.errorCorrection];
      const maxCapacityIndex = CHARACTER_COUNT_MAX_VERSION[ccIndex];
      let bitSize: number = isMixedMode ? 0 : this.segments[0].value.length;

      const maxDataCapacity = isMixedMode
        ? (capacityArray[maxCapacityIndex - 1] + 2) * 8
        : capacityArray[maxCapacityIndex - 1];

      if (isMixedMode) {
        this.segments.forEach((d) => {
          bitSize +=
            MODE_INDICATOR_BITS + MODE_BITS[d.mode][ccIndex] + getBitsLength(d);
        });
      }

      if (bitSize <= maxDataCapacity) {
        let startIndex = CHARACTER_COUNT_MAX_VERSION[ccIndex - 1] - 1 || 0;

        // inner loop qr version
        for (let i = startIndex; i < maxCapacityIndex; i++) {
          const capacity = isMixedMode
            ? (capacityArray[i] + 2) * 8
            : capacityArray[i];

          if (bitSize <= capacity) {
            version = i + 1;
            break ccLoop;
          }
        }
      }
    }

    return version;
  }

  private fillBlock(x: number, y: number, size: PatternSize) {
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
  private fillTimingPattern() {
    let length = this.noOfModules - FINDER_PATTERN_SIZE * 2 - 2;
    for (let i = 1; i <= length; i = i + 2) {
      const hIndex = FINDER_PATTERN_SIZE + i + this.noOfModules * 6;
      const vIndex = (FINDER_PATTERN_SIZE + i) * this.noOfModules + 6;

      this.data[hIndex] = 1;
      this.data[vIndex] = 1;
    }
  }

  // fill finderPattern with 1
  private fillFinderPattern() {
    this.fillBlock(0, 0, FINDER_PATTERN_SIZE);
    this.fillBlock(
      this.noOfModules - FINDER_PATTERN_SIZE,
      0,
      FINDER_PATTERN_SIZE
    );
    this.fillBlock(
      0,
      this.noOfModules - FINDER_PATTERN_SIZE,
      FINDER_PATTERN_SIZE
    );
  }

  // fill alignmentPattern
  private fillAlignmentPattern() {
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
      this.fillBlock(x - 2, y - 2, ALIGNMENT_PATTERN_SIZE);
      yIndex++;
    }
  }

  print() {
    for (let i = 0; i < this.noOfModules; i++) {
      for (let j = 0; j < this.noOfModules; j++) {
        const index = i * this.noOfModules + j;
        if (this.data[index] === 1) {
          process.stdout.write("██");
          // process.stdout.write("1 ");
          continue;
        }
        process.stdout.write(`${this.data[index]} `);
      }
      process.stdout.write("\n");
    }
  }
}
