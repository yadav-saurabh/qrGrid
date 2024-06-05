import {
  ALIGNMENT_PATTERN_DIFFS,
  ALIGNMENT_PATTERN_SIZE,
  ALIGNMENT_PATTERN_TOTALS,
  ALPHANUMERIC_CHARSET,
  CHARACTER_COUNT_INDICATOR,
  FINDER_PATTERN_SIZE,
  MODE_BITS,
  MODE_INDICATOR,
} from "./constants";
import { ErrorCorrectionLevel, Mode } from "./enums";
import { Range } from "./types/range";
import { regexString } from "./utils";

type PatternSize = typeof FINDER_PATTERN_SIZE | typeof ALIGNMENT_PATTERN_SIZE;
type QrOptions = {
  version?: Range<1, 40>;
  mode?: keyof typeof Mode;
  errorCorrection?: keyof typeof ErrorCorrectionLevel;
};

export default class QR {
  readonly inputData: string;
  private inputType: { value: string; mode: Mode }[] = [];
  data: Uint8Array;
  noOfModules: number;
  version: number;
  mode: keyof typeof Mode | "Mixed";
  errorCorrection: ErrorCorrectionLevel;

  constructor(inputData: string, options?: QrOptions) {
    const encoder = new TextEncoder();
    const uint8array = encoder.encode(inputData);
    console.log(uint8array);
    console.log(uint8array.buffer);

    this.inputData = inputData;
    this.mode = options?.mode || "Mixed";
    this.version = options?.version || this.getVersion();
    this.errorCorrection =
      ErrorCorrectionLevel[options?.errorCorrection || "M"];
    this.noOfModules = this.version * 4 + 17;
    this.data = new Uint8Array(this.noOfModules * this.noOfModules);

    this.fillFinderPattern();
    this.fillTimingPattern();
    this.fillAlignmentPattern();
    this.print();
  }

  private getNumericBinary(data: string, characterCountIndex: number) {
    const modeBinary = MODE_INDICATOR[Mode.Numeric];
    const characterCountBits =
      CHARACTER_COUNT_INDICATOR[Mode.Numeric][characterCountIndex];
    const characterCountBinary = data.length
      .toString(2)
      .padStart(characterCountBits, "0");

    let bitString = modeBinary + characterCountBinary;

    for (let i = 0; i < data.length; i = i + 3) {
      const first = data[i];
      const second = data[i + 1] || null;
      const third = data[i + 2] || null;

      if (third !== null) {
        let value = Number(first + second + third);
        bitString += value
          .toString(2)
          .padStart(MODE_BITS[Mode.Numeric][2], "0");
      } else if (second !== null) {
        let value = Number(first + second);
        bitString += value
          .toString(2)
          .padStart(MODE_BITS[Mode.Numeric][1], "0");
      } else {
        let value = Number(first);
        bitString += value
          .toString(2)
          .padStart(MODE_BITS[Mode.Numeric][0], "0");
      }
    }
    return bitString;
  }

  private getAlphaNumericBinary(data: string, characterCountIndex: number) {
    const modeBinary = MODE_INDICATOR[Mode.AlphaNumeric];
    const characterCountBits =
      CHARACTER_COUNT_INDICATOR[Mode.AlphaNumeric][characterCountIndex];
    const characterCountBinary = data.length
      .toString(2)
      .padStart(characterCountBits, "0");

    let bitString = modeBinary + characterCountBinary;

    for (let i = 0; i < data.length; i = i + 2) {
      const first = ALPHANUMERIC_CHARSET.indexOf(data[i]);
      const second = data[i + 1] ? ALPHANUMERIC_CHARSET.indexOf(data[i]) : null;

      if (second !== null) {
        let value = first * 45 + second;
        bitString += value
          .toString(2)
          .padStart(MODE_BITS[Mode.AlphaNumeric][1], "0");
      } else {
        let value = first;
        bitString += value
          .toString(2)
          .padStart(MODE_BITS[Mode.AlphaNumeric][0], "0");
      }
    }
    return bitString;
  }

  private getByteBinary(data: string, characterCountIndex: number) {
    const modeBinary = MODE_INDICATOR[Mode.Byte];
    const characterCountBits =
      CHARACTER_COUNT_INDICATOR[Mode.Byte][characterCountIndex];
    const characterCountBinary = data.length
      .toString(2)
      .padStart(characterCountBits, "0");

    let bitString = modeBinary + characterCountBinary;

    for (let i = 0; i < data.length; i++) {
      let value = data
        .charCodeAt(i)
        .toString(2)
        .padStart(MODE_BITS[Mode.Byte][0], "0");
      bitString += value;
    }
    return bitString;
  }

  /**
   * Get The Qr Code Version
   */
  private getVersion(): number {
    const regStr = [
      `(${regexString[Mode.AlphaNumeric]})`,
      `(${regexString[Mode.Numeric]})`,
      `(${regexString[Mode.Byte]})`,
    ];
    const regex = new RegExp(regStr.join("|"), "g");
    let match: RegExpExecArray | null;

    // split the input string to specific mode
    while ((match = regex.exec(this.inputData)) !== null) {
      if (match[1]) {
        this.inputType.push({ value: match[1], mode: Mode.AlphaNumeric });
      } else if (match[2]) {
        this.inputType.push({ value: match[2], mode: Mode.Numeric });
      } else if (match[3]) {
        this.inputType.push({ value: match[3], mode: Mode.Byte });
      }
    }

    for (let ccIndex = 0; ccIndex < 3; ccIndex++) {
      let bitString = "";
      this.inputType.forEach((d) => {
        if (d.mode === Mode.Numeric) {
          bitString += this.getNumericBinary(d.value, ccIndex);
        }
        if (d.mode === Mode.AlphaNumeric) {
          bitString += this.getAlphaNumericBinary(d.value, ccIndex);
        }
        if (d.mode === Mode.Byte) {
          bitString += this.getByteBinary(d.value, ccIndex);
        }
      });
      console.log({ bitString, length: bitString.length });
    }

    console.log(this.inputType);

    return 1;
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
    console.log(positions);

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
