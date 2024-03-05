const FINDER_PATTERN_SIZE = {
  outer: 7,
  inner: 3,
};
const QR_SIZE = 21;

const dataArray = new Uint8Array(QR_SIZE * QR_SIZE);

for (let i = 0; i < FINDER_PATTERN_SIZE.outer; i++) {
  for (let j = 0; j < FINDER_PATTERN_SIZE.outer; j++) {
    const topRightIndex = i * QR_SIZE + j;
    const topLeftIndex = i * QR_SIZE + QR_SIZE - j - 1;
    const bottomRightIndex = (QR_SIZE - i - 1) * QR_SIZE + j;

    if (j === 0 || j === FINDER_PATTERN_SIZE.outer - 1) {
      dataArray[topRightIndex] = 1;
      dataArray[topLeftIndex] = 1;
      dataArray[bottomRightIndex] = 1;
    }
    if (i === 0 || i === FINDER_PATTERN_SIZE.outer - 1) {
      dataArray[topRightIndex] = 1;
      dataArray[topLeftIndex] = 1;
      dataArray[bottomRightIndex] = 1;
    }
    if (
      j !== 1 &&
      j !== FINDER_PATTERN_SIZE.outer - 2 &&
      (i === FINDER_PATTERN_SIZE.inner - 1 ||
        i === FINDER_PATTERN_SIZE.inner + 1)
    ) {
      dataArray[topRightIndex] = 1;
      dataArray[topLeftIndex] = 1;
      dataArray[bottomRightIndex] = 1;
    }
    if (
      i !== 1 &&
      i !== FINDER_PATTERN_SIZE.outer - 2 &&
      (j === FINDER_PATTERN_SIZE.inner - 1 ||
        j === FINDER_PATTERN_SIZE.inner + 1)
    ) {
      dataArray[topRightIndex] = 1;
      dataArray[topLeftIndex] = 1;
      dataArray[bottomRightIndex] = 1;
    }
  }
}

for (let i = 0; i < QR_SIZE; i++) {
  for (let j = 0; j < QR_SIZE; j++) {
    const index = i * QR_SIZE + j;
    if (dataArray[index] === 1) {
      process.stdout.write("██");
      // process.stdout.write("1 ");
      continue;
    }
    process.stdout.write("0 ");
  }
  process.stdout.write("\n");
}
