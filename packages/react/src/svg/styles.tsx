/**
 * Styling function that can be used to pass in Qr component
 * @module
 */
import { ReservedBits } from "@qrgrid/core";

import { ModuleStyleFunctionParams } from "./types";
import { getCirclePath } from "./utils";

/**
 * Qr Module styles as dots(circles)
 */
export function dotModuleStyle(
  path: ModuleStyleFunctionParams[0],
  module: ModuleStyleFunctionParams[1],
  qr: ModuleStyleFunctionParams[2]
) {
  const { x, y, size, index } = module;
  const radius = Math.floor(size / 2);
  const circlePath = getCirclePath(x, y, radius);

  if (qr.reservedBits[index]?.type === ReservedBits.FinderPattern) {
    path.finder += circlePath;
  } else {
    path.codeword += circlePath;
  }
}
