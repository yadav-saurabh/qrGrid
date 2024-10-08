/**
 * QR class, generates the qr code in Uint8Array of 1's and 0's from the given input.
 * @module
 */
import {
  ALIGNMENT_PATTERN_DIFFS,
  ALIGNMENT_PATTERN_SIZE,
  ALIGNMENT_PATTERN_TOTALS,
  CHARACTER_COUNT_INDICATOR,
  CHARACTER_COUNT_MAX_VERSION,
  CODEWORDS,
  ERROR_CORRECTION_BITS,
  ERROR_CORRECTION_BLOCK,
  ERROR_CORRECTION_CODEWORDS,
  FINDER_PATTERN_SIZE,
  MASK_PATTERNS,
  MODE_INDICATOR,
  MODE_INDICATOR_BITS,
  PAD_CODEWORDS,
} from "./constants.js";
import {
  ErrorCorrectionLevel,
  ErrorCorrectionLevelType,
  Mode,
  ReservedBits,
  ReservedBitsType,
} from "./enums.js";
import { rsEncode } from "./reed-solomon.js";
import {
  getBasicInputSegments,
  getOptimizedSegments,
  Segments,
} from "./segment.js";
import {
  getEncodedSegmentData,
  getBitsLength,
  getCapacity,
  getCharCountIndicator,
  getVersionInfoBits,
  getFormatInfoBits,
  getMaskPenalty,
} from "./utils.js";

/**
 * Options to generate a new Qr
 */
export type QrOptions = {
  errorCorrection?: ErrorCorrectionLevelType;
};
type PatternSize = typeof FINDER_PATTERN_SIZE | typeof ALIGNMENT_PATTERN_SIZE;

/**
 * Generates a Qr code
 */
export class QR {
  readonly inputData: string;
  segments: Segments;
  data: Uint8Array;
  gridSize: number;
  version: number;
  errorCorrection: ErrorCorrectionLevelType;
  reservedBits: Record<number, { type: ReservedBitsType; dark: boolean }>;
  maskPatten: number;
  #codewords: Uint8Array;
  #codeBitLength: number;

  constructor(inputData: string, options?: QrOptions) {
    if (!inputData) {
      throw new Error("Not a valid string input");
    }

    this.inputData = inputData;
    this.errorCorrection =
      ErrorCorrectionLevel[options?.errorCorrection || ErrorCorrectionLevel.M];
    this.reservedBits = {};

    this.segments = getBasicInputSegments(inputData);
    this.version = this.#getVersion();
    this.gridSize = this.version * 4 + 17;

    this.data = new Uint8Array(this.gridSize * this.gridSize);
    this.#codewords = new Uint8Array(CODEWORDS[this.version - 1]);
    this.#codeBitLength = 0;
    this.maskPatten = 0;

    this.#generateQr();
  }

  #generateQr() {
    this.#generateCodeword();
    this.#fillFinderPattern();
    this.#fillTimingPattern();
    this.#fillAlignmentPattern();
    if (this.version >= 7) {
      this.#fillVersionInfo();
    }
    this.#reserveBits();
    this.#fillCodeword();
    this.#mask();
    this.#fillFormatInfo();
  }

  /**
   * calculate the minimum version required for the given input data and Error Correction Level
   */
  #getVersion() {
    let version: number = 0;
    let segments: Segments = [];

    // outer loop character count (CHARACTER_COUNT_INDICATOR length is 3)
    ccLoop: for (let ccIndex = 0; ccIndex < 3; ccIndex++) {
      segments = getOptimizedSegments(this.segments, ccIndex);
      const isMixedMode = segments.length > 1;
      const mode = isMixedMode ? "Mixed" : segments[0].mode;
      const maxCapacityVersion = CHARACTER_COUNT_MAX_VERSION[ccIndex];
      let bitSize = 0;
      if (!isMixedMode) {
        bitSize =
          segments[0].mode === Mode.Byte
            ? getEncodedSegmentData(segments[0]).length
            : segments[0].value.length;
      }

      const maxDataCapacity = getCapacity(
        maxCapacityVersion,
        this.errorCorrection,
        mode
      );

      if (isMixedMode) {
        segments.forEach((d) => {
          bitSize +=
            MODE_INDICATOR_BITS +
            CHARACTER_COUNT_INDICATOR[d.mode][ccIndex] +
            getBitsLength(d);
        });
      }
      if (bitSize <= maxDataCapacity) {
        let startIndex = CHARACTER_COUNT_MAX_VERSION[ccIndex - 1] || 1;

        // inner loop qr version
        for (let i = startIndex; i <= maxCapacityVersion; i++) {
          const capacity = getCapacity(i, this.errorCorrection, mode);

          if (bitSize <= capacity) {
            version = i;
            break ccLoop;
          }
        }
      }
    }
    this.segments = segments;
    return version;
  }

  /**
   * encode the data to it's binary 8 bit format
   */
  #encodeCodeword(codewords: Uint8Array, data: number, bitLen: number) {
    for (let i = 0; i < bitLen; i++) {
      const bit = (data >>> (bitLen - i - 1)) & 1;
      const codewordIndex = Math.floor(this.#codeBitLength / 8);
      if (codewords.length <= codewordIndex) {
        codewords[codewordIndex + 1] = 0;
      }

      if (bit) {
        codewords[codewordIndex] |= 0x80 >>> this.#codeBitLength % 8;
      }
      this.#codeBitLength++;
    }
  }

  /**
   * Generate and encode the Input data to it equivalent Modes and Error Correction Codewords
   */
  #generateCodeword() {
    const totalCodeword = this.#codewords.length;
    const ecTotalCodeword =
      ERROR_CORRECTION_CODEWORDS[this.errorCorrection][this.version - 1];
    const dataTotalCodeword = totalCodeword - ecTotalCodeword;
    const dataTotalCodewordBit = dataTotalCodeword * 8;

    const dcData = new Uint8Array(totalCodeword - ecTotalCodeword);
    const ecData = new Uint8Array(ecTotalCodeword);

    // encode segment data
    for (let index = 0; index < this.segments.length; index++) {
      const segment = this.segments[index];
      // encode mode
      this.#encodeCodeword(
        dcData,
        MODE_INDICATOR[segment.mode],
        MODE_INDICATOR_BITS
      );
      // get encoded segment data
      const segmentBitArray = getEncodedSegmentData(segment);
      // encode character count indicator
      const ccLength =
        segment.mode === Mode.Byte
          ? segmentBitArray.length
          : segment.value.length;
      this.#encodeCodeword(
        dcData,
        ccLength,
        getCharCountIndicator(segment.mode, this.version)
      );
      // encode segment
      for (let i = 0; i < segmentBitArray.length; i++) {
        const segmentBit = segmentBitArray[i];
        this.#encodeCodeword(dcData, segmentBit.data, segmentBit.bitLength);
      }
    }
    // Add terminator Bits 4 0s (if bitString is more than 4 bit shorter than totalCodewordBit)
    if (this.#codeBitLength + 4 <= dataTotalCodewordBit) {
      this.#encodeCodeword(dcData, 0, 4);
    }
    // Add 0's till the bitString is a multiple of 8
    if (this.#codeBitLength % 8 !== 0) {
      this.#encodeCodeword(dcData, 0, 8 - (this.#codeBitLength % 8));
    }
    // Add pad words if bitString is still shorter than the totalCodewordBit
    const remainingByte = (dataTotalCodewordBit - this.#codeBitLength) / 8;
    for (let i = 0; i < remainingByte; i++) {
      this.#encodeCodeword(dcData, PAD_CODEWORDS[i % 2], 8);
    }

    const ecTotalBlock =
      ERROR_CORRECTION_BLOCK[this.errorCorrection][this.version - 1];
    const group2Block = totalCodeword % ecTotalBlock;
    const group1Block = ecTotalBlock - group2Block;
    const group1TotalCodeword = Math.floor(totalCodeword / ecTotalBlock);
    const group1DataTotalCodeword = Math.floor(
      dataTotalCodeword / ecTotalBlock
    );
    const group2DataTotalCodeword = group1DataTotalCodeword + 1;
    // Number of error correction codewords is the same for both groups
    const ecCount = group1TotalCodeword - group1DataTotalCodeword;
    let offset = 0;
    let maxDataSize = 0;
    let blockIndexes = [offset];

    // calculate maxdataSize and generate error correction codewords for each block
    for (let b = 0; b < ecTotalBlock; b++) {
      const dataSize =
        b < group1Block ? group1DataTotalCodeword : group2DataTotalCodeword;
      blockIndexes.push(offset + dataSize);
      // Calculate EC codewords for this data block
      const blockData = dcData.slice(offset, offset + dataSize);
      const errorCodeword = rsEncode(blockData, ecCount);
      ecData.set(errorCodeword, b * ecCount);

      offset += dataSize;
      maxDataSize = Math.max(maxDataSize, dataSize);
    }
    // Interleave the Data Codewords
    let codewordIndex = 0;
    for (let i = 0; i < maxDataSize; i++) {
      for (let j = 0; j < ecTotalBlock; j++) {
        const index = blockIndexes[j] + i;
        if (index < blockIndexes[j + 1]) {
          this.#codewords[codewordIndex++] = dcData[index];
        }
      }
    }
    // Interleave the Error Correction Codewords
    for (let i = 0; i < ecCount; i++) {
      for (let j = 0; j < ecTotalBlock; j++) {
        const index = j * ecCount + i;
        this.#codewords[codewordIndex++] = ecData[index];
      }
    }
  }

  /**
   * reserve Finder Pattern Separator bits, Format Information bits and Dark Module bit
   */
  #reserveBits() {
    const size = this.gridSize;

    // top-left Finder pattern
    this.#reserveFinderSeparatorBits(0, 0);
    // top-right Finder pattern
    this.#reserveFinderSeparatorBits(0, size - FINDER_PATTERN_SIZE);
    // bottom-left Finder pattern
    this.#reserveFinderSeparatorBits(size - FINDER_PATTERN_SIZE, 0);

    // Temporary reserve Format Info to preserve index so that dataCodeword can be filled easily
    // after data masking correct reservation will be applied
    for (let i = 0; i < 8; i++) {
      // top-right index of format info
      const rightTop = size * i + FINDER_PATTERN_SIZE + 1;
      const rightTopTimingBlock =
        size * (FINDER_PATTERN_SIZE - 1) + FINDER_PATTERN_SIZE + 1;
      // bottom-right index of format info
      const rightBottom = size * (size - i) + FINDER_PATTERN_SIZE + 1;
      // bottom-left index of format info
      let bottomLeft = size * (FINDER_PATTERN_SIZE + 1) + i;
      const bottomLeftTimingBlock =
        size * (FINDER_PATTERN_SIZE + 1) + FINDER_PATTERN_SIZE - 1;
      // bottom-right index of format info
      const bottomRight = size * (FINDER_PATTERN_SIZE + 1) + size - i - 1;

      if (rightTop && rightTop !== rightTopTimingBlock) {
        this.reservedBits[rightTop] = {
          type: ReservedBits.FinderPattern,
          dark: false,
        };
      }
      if (rightBottom && rightBottom < this.data.length) {
        this.reservedBits[rightBottom] = {
          type: ReservedBits.FinderPattern,
          dark: false,
        };
      }
      if (bottomLeft) {
        bottomLeft =
          bottomLeft >= bottomLeftTimingBlock ? bottomLeft + 1 : bottomLeft;
        this.reservedBits[bottomLeft] = {
          type: ReservedBits.FinderPattern,
          dark: false,
        };
      }
      if (bottomRight) {
        this.reservedBits[bottomRight] = {
          type: ReservedBits.FinderPattern,
          dark: false,
        };
      }
    }

    // reserve Dark Module
    const darkModule =
      size * (size - FINDER_PATTERN_SIZE - 1) + (FINDER_PATTERN_SIZE + 1);
    this.data[darkModule] = 1;
    this.reservedBits[darkModule] = {
      type: ReservedBits.DarkModule,
      dark: true,
    };
  }

  /**
   * helper function to reserver Finder Pattern Separator bits for the given co ordinates
   */
  #reserveFinderSeparatorBits(x: number, y: number) {
    const size = FINDER_PATTERN_SIZE;
    const height = size + x - 1;
    const width = size + y - 1;
    for (let i = 0; i < size + 1; i++) {
      const left = this.gridSize * (i + x - 1) + y - 1;
      const top = this.gridSize * (x - 1) + i + y;
      const right = this.gridSize * (i + x) + width + 1;
      const down = this.gridSize * (height + 1) + i + y - 1;

      if (x > 0 && top - this.gridSize * (x - 1) < this.gridSize) {
        this.reservedBits[top] = {
          type: ReservedBits.Separator,
          dark: false,
        };
      }
      if (y > 0 && left >= 0) {
        this.reservedBits[left] = {
          type: ReservedBits.Separator,
          dark: false,
        };
      }
      if (
        this.gridSize - x > size &&
        down - this.gridSize * (height + 1) >= 0
      ) {
        this.reservedBits[down] = {
          type: ReservedBits.Separator,
          dark: false,
        };
      }
      if (this.gridSize - y > size && right >= 0 && right <= this.data.length) {
        this.reservedBits[right] = {
          type: ReservedBits.FinderPattern,
          dark: false,
        };
      }
    }
  }

  /**
   * helper function set data for AlignmentPattern and FinderPattern
   */
  #fillBlock(
    x: number,
    y: number,
    size: PatternSize,
    rbType: ReservedBitsType
  ) {
    const height = size + x - 1;
    const width = size + y - 1;
    for (let i = x; i <= height; i++) {
      for (let j = y; j <= width; j++) {
        const index = i * this.gridSize + j;
        this.reservedBits[index] = { type: rbType, dark: false };
        // outer block
        if (j === y || j === width) {
          this.data[index] = 1;
          this.reservedBits[index] = { type: rbType, dark: true };
        }
        if (i === x || i === height) {
          this.data[index] = 1;
          this.reservedBits[index] = { type: rbType, dark: true };
        }
        // inner block
        if (j >= y + 2 && j <= width - 2 && i >= x + 2 && i <= height - 2) {
          this.data[index] = 1;
          this.reservedBits[index] = { type: rbType, dark: true };
        }
      }
    }
  }

  /**
   * set data for TimingPattern
   */
  #fillTimingPattern() {
    let length = this.gridSize - FINDER_PATTERN_SIZE * 2 - 2;
    for (let i = 1; i <= length; i++) {
      const hIndex = FINDER_PATTERN_SIZE + i + this.gridSize * 6;
      const vIndex = (FINDER_PATTERN_SIZE + i) * this.gridSize + 6;

      const dark = i % 2 !== 0;
      this.data[hIndex] = dark ? 1 : 0;
      this.reservedBits[hIndex] = {
        type: ReservedBits.TimingPattern,
        dark: dark,
      };

      this.data[vIndex] = dark ? 1 : 0;
      this.reservedBits[vIndex] = {
        type: ReservedBits.TimingPattern,
        dark: dark,
      };
    }
  }

  /**
   * set data for FinderPattern
   */
  #fillFinderPattern() {
    // top-left finder pattern
    this.#fillBlock(0, 0, FINDER_PATTERN_SIZE, ReservedBits.FinderPattern);
    // top-right finder pattern
    this.#fillBlock(
      0,
      this.gridSize - FINDER_PATTERN_SIZE,
      FINDER_PATTERN_SIZE,
      ReservedBits.FinderPattern
    );
    // bottom-left finder pattern
    this.#fillBlock(
      this.gridSize - FINDER_PATTERN_SIZE,
      0,
      FINDER_PATTERN_SIZE,
      ReservedBits.FinderPattern
    );
  }

  /**
   * set data for AlignmentPattern
   */
  #fillAlignmentPattern() {
    // no AlignmentPattern for version 1
    if (this.version === 1) {
      return;
    }

    // calculate the co-ordinates of the alignment patterns
    const subdivisionCount = Math.floor(this.version / 7);
    const total = ALIGNMENT_PATTERN_TOTALS[subdivisionCount];
    const first = 6; // first co-ordinates is always 6
    const last = this.gridSize - 7; // last co-ordinates is always Modules-7
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
      this.#fillBlock(
        x - 2,
        y - 2,
        ALIGNMENT_PATTERN_SIZE,
        ReservedBits.AlignmentPattern
      );
      yIndex++;
    }
  }

  /**
   * set data for Version Information
   */
  #fillVersionInfo() {
    const bits = getVersionInfoBits(this.version);
    for (let i = 0; i < 18; i++) {
      const bit = (bits >> i) & 1;
      const row = Math.floor(i / 3);
      const col = this.gridSize - 11 + (i % 3);
      // Encode in top-right corner
      const topRightIndex = row * this.gridSize + col;
      this.data[topRightIndex] = bit;
      this.reservedBits[topRightIndex] = {
        type: ReservedBits.VersionInfo,
        dark: bit === 1,
      };
      // Encode in bottom-left corner
      const bottomLeftIndex = col * this.gridSize + row;
      this.data[bottomLeftIndex] = bit;
      this.reservedBits[bottomLeftIndex] = {
        type: ReservedBits.VersionInfo,
        dark: bit === 1,
      };
    }
  }

  /**
   * set data for Format Information
   */
  #fillFormatInfo(maskPattern?: number, qrData?: Uint8Array) {
    const data = qrData || this.data;
    const mask = maskPattern || this.maskPatten;

    const bits = getFormatInfoBits(
      ERROR_CORRECTION_BITS[this.errorCorrection],
      mask
    );

    for (let i = 0; i < 15; i++) {
      const bit = (bits >> i) & 1;

      // vertical
      if (i < 6) {
        const index = i * this.gridSize + 8;

        data[index] = bit;
        this.reservedBits[index] = {
          type: ReservedBits.FormatInfo,
          dark: bit === 1,
        };
      } else if (i < 8) {
        const index = (i + 1) * this.gridSize + 8;
        data[index] = bit;
        this.reservedBits[index] = {
          type: ReservedBits.FormatInfo,
          dark: bit === 1,
        };
      } else {
        const index = (this.gridSize - 15 + i) * this.gridSize + 8;
        data[index] = bit;
        this.reservedBits[index] = {
          type: ReservedBits.FormatInfo,
          dark: bit === 1,
        };
      }

      // horizontal
      if (i < 8) {
        const index = 8 * this.gridSize + this.gridSize - i - 1;
        data[index] = bit;
        this.reservedBits[index] = {
          type: ReservedBits.FormatInfo,
          dark: bit === 1,
        };
      } else if (i < 9) {
        const index = 8 * this.gridSize + 15 - i;
        data[index] = bit;
        this.reservedBits[index] = {
          type: ReservedBits.FormatInfo,
          dark: bit === 1,
        };
      } else {
        const index = 8 * this.gridSize + 15 - i - 1;
        data[index] = bit;
        this.reservedBits[index] = {
          type: ReservedBits.FormatInfo,
          dark: bit === 1,
        };
      }
    }
  }

  /**
   * set data for codewords
   */
  #fillCodeword() {
    let dataIndex = 0;
    let bitIndex = 7; // Starting with the most significant bit of the first byte
    let reverse = true;

    // Traverse the QR code in the zigzag pattern
    for (let col = this.gridSize - 1; col >= 1; col -= 2) {
      if (col === 6) col = 5; // Skipping the vertical timing pattern
      for (let i = this.gridSize - 1; i >= 0; i--) {
        for (let j = 0; j < 2; j++) {
          const row = reverse ? i : this.gridSize - i - 1;
          const index = row * this.gridSize + col - j;
          if (this.reservedBits[index] === undefined) {
            if ((this.#codewords[dataIndex] & (1 << bitIndex)) !== 0) {
              this.data[index] = 1;
            }
            // Move to the next bit
            if (--bitIndex === -1) {
              dataIndex++;
              bitIndex = 7;
            }
          }
        }
        if (i === 0) {
          reverse = !reverse;
        }
      }
    }
  }

  /**
   * calculate mask and apply mask with lowest penalty
   */
  #mask() {
    let bestPattern = 0;
    let lowestPenalty = Infinity;

    for (let i = 0; i < MASK_PATTERNS.length; i++) {
      const maskedData = this.#applyMask(i, true);
      this.#fillFormatInfo(i, maskedData);
      const penalty = getMaskPenalty(maskedData, this.gridSize);

      if (penalty < lowestPenalty) {
        lowestPenalty = penalty;
        bestPattern = i;
      }
    }

    this.maskPatten = bestPattern;
    this.#applyMask(bestPattern);
  }

  /**
   * apply mask
   */
  #applyMask(maskPattern: number, newData?: boolean) {
    const maskedData = newData ? new Uint8Array(this.data) : this.data;
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const index = i * this.gridSize + j;
        if (this.reservedBits[index] === undefined) {
          maskedData[index] =
            this.data[index] ^ Number(MASK_PATTERNS[maskPattern](i, j));
        }
      }
    }
    return maskedData;
  }
}
