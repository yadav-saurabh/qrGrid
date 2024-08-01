/**
 * Styling function that can be used to pass in Qr component
 * @module
 */
import { ReservedBits } from "@qrgrid/core";

import { ModuleStyleFunctionParams } from "./types";
import {
  getCirclePath,
  getSmoothDataBitPath,
  roundCornerFinderPatternPath,
} from "./utils";

/**
 * Qr Module styles as dots(circles)
 */
export function dotModuleStyle(
  path: ModuleStyleFunctionParams[0],
  module: ModuleStyleFunctionParams[1],
  qr: ModuleStyleFunctionParams[2]
) {
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
export function smoothModuleStyle(
  path: ModuleStyleFunctionParams[0],
  module: ModuleStyleFunctionParams[1],
  qr: ModuleStyleFunctionParams[2]
) {
  if (qr.reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
    path.finder += roundCornerFinderPatternPath(module, qr);
    return;
  }
  path.codeword += getSmoothDataBitPath(module, qr);
}
