/**
 * Common Utils functions for both canvas and svg
 * @module
 */
import { QR } from "@qrgrid/core";

/**
 * get Neighbor status of the given index
 */
export function getNeighbor(index: number, qr: QR) {
  const { gridSize, data } = qr;

  const firstModule = index % gridSize === 0;
  const lastModule = index % gridSize === gridSize - 1;

  const leftNeighbor = data[index - 1];
  const rightNeighbor = data[index + 1];
  const topNeighbor = data[index - gridSize];
  const bottomNeighbor = data[index + gridSize];

  const topLeftNeighbor = data[index - gridSize - 1];
  const topRightNeighbor = data[index - gridSize + 1];
  const bottomLeftNeighbor = data[index + gridSize - 1];
  const bottomRightNeighbor = data[index + gridSize + 1];

  return {
    left: !firstModule && leftNeighbor,
    right: !lastModule && rightNeighbor,
    top: topNeighbor,
    bottom: bottomNeighbor,
    topLeft: !firstModule && topLeftNeighbor,
    topRight: !lastModule && topRightNeighbor,
    bottomLeft: !firstModule && bottomLeftNeighbor,
    bottomRight: !lastModule && bottomRightNeighbor,
  };
}

/**
 * get the positions ans sizes of the finder patterns
 */
export function getFinderPatternDetails(size: number, qr: QR) {
  const { gridSize } = qr;

  let positions = {
    inner: [
      { x: size * 3, y: size * 3 },
      { x: size * (gridSize - 4), y: size * 3 },
      { x: size * 3, y: size * (gridSize - 4) },
    ],
    outer: [
      { x: size * 1, y: size * 1 },
      { x: size * (gridSize - 6), y: size * 1 },
      { x: size * 1, y: size * (gridSize - 6) },
    ],
  };
  const sizes = { outer: size * 7, inner: size * 3 };

  return { positions, sizes };
}

/**
 * find if the module is a outer finder pattern module
 */
export function isOuterFinderPattern(index: number, qr: QR) {
  const { reservedBits } = qr;
  const neighbor = getNeighbor(index, qr);
  if (!reservedBits[index]) {
    return false;
  }

  if (!neighbor.top && !neighbor.bottom) {
    return true;
  }
  if (!neighbor.left && !neighbor.right) {
    return true;
  }
  if (!neighbor.top && !neighbor.left && !neighbor.bottomRight) {
    return true;
  }
  if (!neighbor.top && !neighbor.right && !neighbor.bottomLeft) {
    return true;
  }
  if (!neighbor.bottom && !neighbor.right && !neighbor.topLeft) {
    return true;
  }
  if (!neighbor.bottom && !neighbor.left && !neighbor.topRight) {
    return true;
  }
  return false;
}
