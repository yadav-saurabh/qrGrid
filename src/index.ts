import {
  ALIGNMENT_PATTERN_DIFFS,
  ALIGNMENT_PATTERN_SIZE,
  ALIGNMENT_PATTERN_TOTALS,
  FINDER_PATTERN_SIZE,
} from "./constant";

type PatternSize = typeof FINDER_PATTERN_SIZE | typeof ALIGNMENT_PATTERN_SIZE;

export default class QR {
  data: Uint8Array;
  size: number;
  version: number;

  constructor(version: number) {
    this.version = version;
    this.size = this.version * 4 + 17;
    this.data = new Uint8Array(this.size * this.size);
    this.fillFinderPattern();
    this.fillTimingPattern();
    this.fillAlignmentPattern();
    this.print();
  }

  fillBlock(x: number, y: number, size: PatternSize) {
    const height = size + x - 1;
    const width = size + y - 1;
    for (let i = x; i <= height; i++) {
      for (let j = y; j <= width; j++) {
        const index = i * this.size + j;

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
  fillTimingPattern() {
    let length = this.size - FINDER_PATTERN_SIZE * 2 - 2;
    for (let i = 1; i <= length; i = i + 2) {
      const hIndex = FINDER_PATTERN_SIZE + i + this.size * 6;
      const vIndex = (FINDER_PATTERN_SIZE + i) * this.size + 6;

      this.data[hIndex] = 1;
      this.data[vIndex] = 1;
    }
  }

  // fill alignmentPattern with 1
  fillFinderPattern() {
    this.fillBlock(0, 0, FINDER_PATTERN_SIZE);
    this.fillBlock(this.size - FINDER_PATTERN_SIZE, 0, FINDER_PATTERN_SIZE);
    this.fillBlock(0, this.size - FINDER_PATTERN_SIZE, FINDER_PATTERN_SIZE);
  }

  // fill alignmentPattern with 1
  fillAlignmentPattern() {
    if (this.version === 1) {
      return;
    }

    const subdivisionCount = Math.floor(this.version / 7);
    const total = ALIGNMENT_PATTERN_TOTALS[subdivisionCount];
    const first = 6;
    const last = this.size - 7;
    const diff = ALIGNMENT_PATTERN_DIFFS[this.version];
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
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const index = i * this.size + j;
        if (this.data[index] === 1) {
          process.stdout.write("██");
          // process.stdout.write("1 ");
          continue;
        }
        process.stdout.write("0 ");
      }
      process.stdout.write("\n");
    }
  }
}
