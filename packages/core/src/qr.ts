/**
 * QR code generator.
 *
 * Produces a QR code as a flat `Uint8Array` of 1s (dark) and 0s (light)
 * from a given input string.
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

/** Options for QR code generation. */
export interface QrOptions {
  /** Error correction level (defaults to "M"). */
  errorCorrection?: ErrorCorrectionLevelType;
}

/** Metadata stored for each reserved bit position in the grid. */
export interface ReservedBitInfo {
  type: ReservedBitsType;
  dark: boolean;
}

/** Union type for pattern sizes used by finder and alignment patterns. */
type PatternSize = typeof FINDER_PATTERN_SIZE | typeof ALIGNMENT_PATTERN_SIZE;

/** Bits per byte. */
const BITS_PER_BYTE = 8;

/** Number of terminator bits appended after data encoding. */
const TERMINATOR_BITS = 4;

/** Number of version information bits. */
const VERSION_INFO_BITS = 18;

/** Number of format information bits. */
const FORMAT_INFO_BITS = 15;

/** Number of alignment pattern positions (first is always 6). */
const FIRST_ALIGNMENT_POSITION = 6;

/** Offset from grid size to find the last alignment position. */
const LAST_ALIGNMENT_OFFSET = 7;

/**
 * Generates a QR code from the given input string.
 *
 * All computation happens eagerly in the constructor. After construction,
 * the `data` property contains the complete QR grid as a flat array.
 *
 * @example
 * const qr = new QR("https://example.com");
 * // qr.data is a Uint8Array of 0s and 1s
 * // qr.gridSize is the number of modules per side
 */
export class QR {
  /** The original input string. */
  readonly inputData: string;

  /** Optimized encoding segments derived from the input. */
  segments: Segments;

  /** Flat QR grid data: 1 = dark module, 0 = light module. Length is `gridSize * gridSize`. */
  data: Uint8Array;

  /** Number of modules per side of the QR grid. */
  gridSize: number;

  /** QR version (1-40). */
  version: number;

  /** Error correction level used. */
  errorCorrection: ErrorCorrectionLevelType;

  /** Map of grid indices to their reserved bit metadata. */
  reservedBits: Record<number, ReservedBitInfo>;

  /** Index of the mask pattern applied (0-7). */
  maskPattern: number;

  #codewords: Uint8Array;
  #codeBitLength: number;

  /**
   * Creates a new QR code.
   *
   * @param inputData - The string to encode. Must be non-empty.
   * @param options - Optional generation parameters.
   * @throws {Error} If `inputData` is empty or falsy.
   */
  constructor(inputData: string, options?: QrOptions) {
    if (!inputData) {
      throw new Error("Not a valid string input");
    }

    this.inputData = inputData;
    this.errorCorrection =
      ErrorCorrectionLevel[options?.errorCorrection ?? ErrorCorrectionLevel.M];
    this.reservedBits = {};

    this.segments = getBasicInputSegments(inputData);
    this.version = this.#getVersion();
    this.gridSize = this.version * 4 + 17;

    this.data = new Uint8Array(this.gridSize * this.gridSize);
    this.#codewords = new Uint8Array(CODEWORDS[this.version - 1]);
    this.#codeBitLength = 0;
    this.maskPattern = 0;

    this.#generateQr();
  }

  /** Runs the full QR generation pipeline. */
  #generateQr(): void {
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
   * Determines the minimum QR version required for the input data
   * and current error correction level.
   */
  #getVersion(): number {
    let version = 0;
    let segments: Segments = [];

    // Iterate through character count indicator ranges (3 ranges)
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
        mode,
      );

      if (isMixedMode) {
        for (const segment of segments) {
          bitSize +=
            MODE_INDICATOR_BITS +
            CHARACTER_COUNT_INDICATOR[segment.mode][ccIndex] +
            getBitsLength(segment);
        }
      }

      if (bitSize <= maxDataCapacity) {
        const startIndex = CHARACTER_COUNT_MAX_VERSION[ccIndex - 1] || 1;

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
   * Encodes a value into the codeword buffer at the current bit position.
   *
   * @param codewords - Target codeword buffer.
   * @param data - Numeric value to encode.
   * @param bitLen - Number of bits to write.
   */
  #encodeCodeword(codewords: Uint8Array, data: number, bitLen: number): void {
    for (let i = 0; i < bitLen; i++) {
      const bit = (data >>> (bitLen - i - 1)) & 1;
      const codewordIndex = Math.floor(this.#codeBitLength / BITS_PER_BYTE);

      if (codewords.length <= codewordIndex) {
        codewords[codewordIndex + 1] = 0;
      }

      if (bit) {
        codewords[codewordIndex] |=
          0x80 >>> (this.#codeBitLength % BITS_PER_BYTE);
      }
      this.#codeBitLength++;
    }
  }

  /**
   * Encodes input data into data codewords and generates Reed-Solomon
   * error correction codewords. Interleaves both into the final codeword stream.
   */
  #generateCodeword(): void {
    const totalCodeword = this.#codewords.length;
    const ecTotalCodeword =
      ERROR_CORRECTION_CODEWORDS[this.errorCorrection][this.version - 1];
    const dataTotalCodeword = totalCodeword - ecTotalCodeword;
    const dataTotalCodewordBit = dataTotalCodeword * BITS_PER_BYTE;

    const dcData = new Uint8Array(dataTotalCodeword);
    const ecData = new Uint8Array(ecTotalCodeword);

    // Encode each segment's mode indicator, character count, and data
    for (let index = 0; index < this.segments.length; index++) {
      const segment = this.segments[index];

      // Mode indicator
      this.#encodeCodeword(
        dcData,
        MODE_INDICATOR[segment.mode],
        MODE_INDICATOR_BITS,
      );

      // Encoded segment data
      const segmentBitArray = getEncodedSegmentData(segment);

      // Character count indicator
      const ccLength =
        segment.mode === Mode.Byte
          ? segmentBitArray.length
          : segment.value.length;
      this.#encodeCodeword(
        dcData,
        ccLength,
        getCharCountIndicator(segment.mode, this.version),
      );

      // Segment data bits
      for (const segmentBit of segmentBitArray) {
        this.#encodeCodeword(dcData, segmentBit.data, segmentBit.bitLength);
      }
    }

    // Add terminator bits (4 zeros if space allows)
    if (this.#codeBitLength + TERMINATOR_BITS <= dataTotalCodewordBit) {
      this.#encodeCodeword(dcData, 0, TERMINATOR_BITS);
    }

    // Pad to byte boundary
    if (this.#codeBitLength % BITS_PER_BYTE !== 0) {
      this.#encodeCodeword(
        dcData,
        0,
        BITS_PER_BYTE - (this.#codeBitLength % BITS_PER_BYTE),
      );
    }

    // Fill remaining capacity with alternating pad codewords
    const remainingBytes =
      (dataTotalCodewordBit - this.#codeBitLength) / BITS_PER_BYTE;
    for (let i = 0; i < remainingBytes; i++) {
      this.#encodeCodeword(dcData, PAD_CODEWORDS[i % 2], BITS_PER_BYTE);
    }

    // Calculate error correction block structure
    const ecTotalBlock =
      ERROR_CORRECTION_BLOCK[this.errorCorrection][this.version - 1];
    const group2Block = totalCodeword % ecTotalBlock;
    const group1Block = ecTotalBlock - group2Block;
    const group1TotalCodeword = Math.floor(totalCodeword / ecTotalBlock);
    const group1DataTotalCodeword = Math.floor(
      dataTotalCodeword / ecTotalBlock,
    );
    const group2DataTotalCodeword = group1DataTotalCodeword + 1;
    const ecCount = group1TotalCodeword - group1DataTotalCodeword;

    let offset = 0;
    let maxDataSize = 0;
    const blockIndexes = [offset];

    // Generate error correction codewords for each block
    for (let b = 0; b < ecTotalBlock; b++) {
      const dataSize =
        b < group1Block ? group1DataTotalCodeword : group2DataTotalCodeword;
      blockIndexes.push(offset + dataSize);

      const blockData = dcData.slice(offset, offset + dataSize);
      const errorCodeword = rsEncode(blockData, ecCount);
      ecData.set(errorCodeword, b * ecCount);

      offset += dataSize;
      maxDataSize = Math.max(maxDataSize, dataSize);
    }

    // Interleave data codewords
    let codewordIndex = 0;
    for (let i = 0; i < maxDataSize; i++) {
      for (let j = 0; j < ecTotalBlock; j++) {
        const index = blockIndexes[j] + i;
        if (index < blockIndexes[j + 1]) {
          this.#codewords[codewordIndex++] = dcData[index];
        }
      }
    }

    // Interleave error correction codewords
    for (let i = 0; i < ecCount; i++) {
      for (let j = 0; j < ecTotalBlock; j++) {
        const index = j * ecCount + i;
        this.#codewords[codewordIndex++] = ecData[index];
      }
    }
  }

  /**
   * Reserves bit positions for finder pattern separators, format information,
   * and the dark module.
   */
  #reserveBits(): void {
    const size = this.gridSize;

    // Finder pattern separators
    this.#reserveFinderSeparatorBits(0, 0);
    this.#reserveFinderSeparatorBits(0, size - FINDER_PATTERN_SIZE);
    this.#reserveFinderSeparatorBits(size - FINDER_PATTERN_SIZE, 0);

    // Temporarily reserve format info positions to prevent codeword placement
    for (let i = 0; i < BITS_PER_BYTE; i++) {
      const rightTop = size * i + FINDER_PATTERN_SIZE + 1;
      const rightTopTimingBlock =
        size * (FINDER_PATTERN_SIZE - 1) + FINDER_PATTERN_SIZE + 1;
      const rightBottom = size * (size - i) + FINDER_PATTERN_SIZE + 1;
      let bottomLeft = size * (FINDER_PATTERN_SIZE + 1) + i;
      const bottomLeftTimingBlock =
        size * (FINDER_PATTERN_SIZE + 1) + FINDER_PATTERN_SIZE - 1;
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

    // Dark module (always dark, always at a fixed position)
    const darkModule =
      size * (size - FINDER_PATTERN_SIZE - 1) + (FINDER_PATTERN_SIZE + 1);
    this.data[darkModule] = 1;
    this.reservedBits[darkModule] = {
      type: ReservedBits.DarkModule,
      dark: true,
    };
  }

  /**
   * Reserves separator bit positions around a finder pattern.
   *
   * @param x - Row offset of the finder pattern.
   * @param y - Column offset of the finder pattern.
   */
  #reserveFinderSeparatorBits(x: number, y: number): void {
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
   * Fills a rectangular block pattern (used for both finder and alignment patterns).
   *
   * @param x - Top-left row.
   * @param y - Top-left column.
   * @param size - Pattern size (7 for finder, 5 for alignment).
   * @param rbType - Reserved bit type to assign.
   */
  #fillBlock(
    x: number,
    y: number,
    size: PatternSize,
    rbType: ReservedBitsType,
  ): void {
    const height = size + x - 1;
    const width = size + y - 1;

    for (let i = x; i <= height; i++) {
      for (let j = y; j <= width; j++) {
        const index = i * this.gridSize + j;
        this.reservedBits[index] = { type: rbType, dark: false };

        // Outer border
        if (j === y || j === width || i === x || i === height) {
          this.data[index] = 1;
          this.reservedBits[index] = { type: rbType, dark: true };
        }

        // Inner block
        if (j >= y + 2 && j <= width - 2 && i >= x + 2 && i <= height - 2) {
          this.data[index] = 1;
          this.reservedBits[index] = { type: rbType, dark: true };
        }
      }
    }
  }

  /** Places the horizontal and vertical timing patterns. */
  #fillTimingPattern(): void {
    const length = this.gridSize - FINDER_PATTERN_SIZE * 2 - 2;

    for (let i = 1; i <= length; i++) {
      const hIndex = FINDER_PATTERN_SIZE + i + this.gridSize * 6;
      const vIndex = (FINDER_PATTERN_SIZE + i) * this.gridSize + 6;
      const dark = i % 2 !== 0;

      this.data[hIndex] = dark ? 1 : 0;
      this.reservedBits[hIndex] = {
        type: ReservedBits.TimingPattern,
        dark,
      };

      this.data[vIndex] = dark ? 1 : 0;
      this.reservedBits[vIndex] = {
        type: ReservedBits.TimingPattern,
        dark,
      };
    }
  }

  /** Places the three finder patterns (top-left, top-right, bottom-left). */
  #fillFinderPattern(): void {
    this.#fillBlock(0, 0, FINDER_PATTERN_SIZE, ReservedBits.FinderPattern);
    this.#fillBlock(
      0,
      this.gridSize - FINDER_PATTERN_SIZE,
      FINDER_PATTERN_SIZE,
      ReservedBits.FinderPattern,
    );
    this.#fillBlock(
      this.gridSize - FINDER_PATTERN_SIZE,
      0,
      FINDER_PATTERN_SIZE,
      ReservedBits.FinderPattern,
    );
  }

  /** Places alignment patterns (version >= 2). */
  #fillAlignmentPattern(): void {
    if (this.version === 1) {
      return;
    }

    // Calculate alignment pattern center positions
    const subdivisionCount = Math.floor(this.version / 7);
    const total = ALIGNMENT_PATTERN_TOTALS[subdivisionCount];
    const first = FIRST_ALIGNMENT_POSITION;
    const last = this.gridSize - LAST_ALIGNMENT_OFFSET;
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
        ReservedBits.AlignmentPattern,
      );
      yIndex++;
    }
  }

  /** Places version information bits (version >= 7). */
  #fillVersionInfo(): void {
    const bits = getVersionInfoBits(this.version);

    for (let i = 0; i < VERSION_INFO_BITS; i++) {
      const bit = (bits >> i) & 1;
      const row = Math.floor(i / 3);
      const col = this.gridSize - 11 + (i % 3);

      // Top-right corner
      const topRightIndex = row * this.gridSize + col;
      this.data[topRightIndex] = bit;
      this.reservedBits[topRightIndex] = {
        type: ReservedBits.VersionInfo,
        dark: bit === 1,
      };

      // Bottom-left corner
      const bottomLeftIndex = col * this.gridSize + row;
      this.data[bottomLeftIndex] = bit;
      this.reservedBits[bottomLeftIndex] = {
        type: ReservedBits.VersionInfo,
        dark: bit === 1,
      };
    }
  }

  /**
   * Places format information bits around the finder patterns.
   *
   * @param maskPatternOverride - Mask pattern to use (defaults to `this.maskPattern`).
   * @param qrData - Data array to write to (defaults to `this.data`).
   */
  #fillFormatInfo(maskPatternOverride?: number, qrData?: Uint8Array): void {
    const data = qrData ?? this.data;
    const mask = maskPatternOverride ?? this.maskPattern;

    const bits = getFormatInfoBits(
      ERROR_CORRECTION_BITS[this.errorCorrection],
      mask,
    );

    for (let i = 0; i < FORMAT_INFO_BITS; i++) {
      const bit = (bits >> i) & 1;

      // Vertical placement
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
        const index =
          (this.gridSize - FORMAT_INFO_BITS + i) * this.gridSize + 8;
        data[index] = bit;
        this.reservedBits[index] = {
          type: ReservedBits.FormatInfo,
          dark: bit === 1,
        };
      }

      // Horizontal placement
      if (i < 8) {
        const index = 8 * this.gridSize + this.gridSize - i - 1;
        data[index] = bit;
        this.reservedBits[index] = {
          type: ReservedBits.FormatInfo,
          dark: bit === 1,
        };
      } else if (i < 9) {
        const index = 8 * this.gridSize + FORMAT_INFO_BITS - i;
        data[index] = bit;
        this.reservedBits[index] = {
          type: ReservedBits.FormatInfo,
          dark: bit === 1,
        };
      } else {
        const index = 8 * this.gridSize + FORMAT_INFO_BITS - i - 1;
        data[index] = bit;
        this.reservedBits[index] = {
          type: ReservedBits.FormatInfo,
          dark: bit === 1,
        };
      }
    }
  }

  /** Fills data and error correction codewords in the zigzag placement pattern. */
  #fillCodeword(): void {
    let dataIndex = 0;
    let bitIndex = 7; // Most significant bit first
    let reverse = true;

    for (let col = this.gridSize - 1; col >= 1; col -= 2) {
      // Skip the vertical timing pattern column
      if (col === 6) col = 5;

      for (let i = this.gridSize - 1; i >= 0; i--) {
        for (let j = 0; j < 2; j++) {
          const row = reverse ? i : this.gridSize - i - 1;
          const index = row * this.gridSize + col - j;

          if (this.reservedBits[index] === undefined) {
            if ((this.#codewords[dataIndex] & (1 << bitIndex)) !== 0) {
              this.data[index] = 1;
            }
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

  /** Evaluates all 8 mask patterns and applies the one with the lowest penalty. */
  #mask(): void {
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

    this.maskPattern = bestPattern;
    this.#applyMask(bestPattern);
  }

  /**
   * Applies a mask pattern to the QR data grid.
   *
   * @param maskPatternIndex - Mask pattern index (0-7).
   * @param copyData - If true, returns a copy instead of mutating `this.data`.
   * @returns The masked data array.
   */
  #applyMask(maskPatternIndex: number, copyData?: boolean): Uint8Array {
    const maskedData = copyData ? new Uint8Array(this.data) : this.data;

    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const index = i * this.gridSize + j;
        if (this.reservedBits[index] === undefined) {
          maskedData[index] =
            this.data[index] ^ Number(MASK_PATTERNS[maskPatternIndex](i, j));
        }
      }
    }

    return maskedData;
  }
}
