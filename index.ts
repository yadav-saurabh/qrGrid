const FINDER_PATTERN_SIZE = 7;

class QR {
  data: Uint8Array;
  size: number;

  constructor(size: number) {
    this.size = size;
    this.data = new Uint8Array(size * size);
    this.fillBlock(FINDER_PATTERN_SIZE);
    this.print();
  }

  // fill block
  // finderPattern -> patternSize : 7
  // timelineBlock -> patternSize : 5
  fillBlock(patternSize: number, x = 0, y = 0) {
    const height = patternSize + x - 1;
    const width = patternSize + y - 1;
    for (let i = x; i <= height; i++) {
      for (let j = y; j <= width; j++) {
        const topLIndex = i * this.size + j;
        const topRIndex = i * this.size + this.size - j - 1;
        const bottomLIndex = (this.size - i - 1) * this.size + j;

        // outer block
        if (j === y || j === width) {
          this.data[topLIndex] = 1;
          this.data[topRIndex] = 1;
          this.data[bottomLIndex] = 1;
        }
        if (i === x || i === height) {
          this.data[topLIndex] = 1;
          this.data[topRIndex] = 1;
          this.data[bottomLIndex] = 1;
        }
        // inner block
        if (j >= y + 2 && j <= width - 2 && i >= x + 2 && i <= height - 2) {
          this.data[topLIndex] = 1;
          this.data[topRIndex] = 1;
          this.data[bottomLIndex] = 1;
        }
      }
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

new QR(21);
