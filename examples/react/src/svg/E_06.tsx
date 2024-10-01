import { ErrorCorrectionLevelType, QR, ReservedBits } from "@qrgrid/core";
import { Qr, ModuleStyleFunctionParams } from "@qrgrid/react/svg";
import {
  getFinderPatternDetails,
  isOuterFinderPattern,
} from "@qrgrid/styles/common";
import { getCirclePath, getSquarePath } from "@qrgrid/styles/svg";

type PropTypes = {
  input: string;
  errorCorrection: ErrorCorrectionLevelType;
  finderColor: string;
};

function E_06(props: PropTypes) {
  const qrModuleStyle = (
    path: ModuleStyleFunctionParams[0],
    module: ModuleStyleFunctionParams[1],
    qr: QR
  ) => {
    const { reservedBits } = qr;
    const { x, y } = module;
    if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      if (isOuterFinderPattern(module.index, qr)) {
        path.finder += getSquarePath(x, y, module.size);
      }
    } else {
      const size = module.size * 0.95;
      const squarePath = `M${x} ${y}v${size}h${size}v-${size}z`;
      path.codeword += squarePath;
    }
  };

  const onGenerated = (
    path: ModuleStyleFunctionParams[0],
    size: number,
    qr: QR
  ) => {
    const { positions, sizes } = getFinderPatternDetails(size, qr);
    for (let i = 0; i < positions.inner.length; i++) {
      const pos = positions.inner[i];
      path.finder += getCirclePath(pos.x, pos.y, sizes.inner);
    }
  };

  return (
    <Qr
      input={props.input}
      qrOptions={{ errorCorrection: props.errorCorrection }}
      moduleStyle={qrModuleStyle}
      onGenerated={onGenerated}
      color={{ finder: props.finderColor }}
      image={{ src: "./vite.svg", overlap: false }}
    />
  );
}

export default E_06;
