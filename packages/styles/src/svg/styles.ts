/**
 * Styling function that can be used to pass in Qr component
 * @module
 */
import { QR, ReservedBits } from "@qrgrid/core";

import {
  getSmoothEdgesPath,
  getCirclePath,
  ModuleType,
  PathType,
} from "./utils.js";

/**
 * Qr Module styles as dots(circles)
 */
export function dotModuleStyle(path: PathType, module: ModuleType, qr: QR) {
  const { x, y, size, index } = module;
  const circlePath = getCirclePath(x, y, size);

  if (qr.reservedBits[index]?.type === ReservedBits.FinderPattern) {
    path.finder += circlePath;
  } else {
    path.codeword += circlePath;
  }
}

/**
 * Qr Module styles with with smooth edges
 */
export function smoothModuleStyle(path: PathType, module: ModuleType, qr: QR) {
  if (qr.reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
    path.finder += getSmoothEdgesPath(module, qr);
    return;
  }
  path.codeword += getSmoothEdgesPath(module, qr);
}
