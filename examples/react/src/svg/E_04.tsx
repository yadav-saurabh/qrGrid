import { ErrorCorrectionLevelType, QR, ReservedBits } from "@qrgrid/core";
import { Qr, ModuleStyleFunctionParams } from "@qrgrid/react/svg";
import { getFinderPatternDetails } from "@qrgrid/styles/common";
import { getCircleOutlinePath, getCirclePath } from "@qrgrid/styles/svg";

type PropTypes = {
  input: string;
  errorCorrection: ErrorCorrectionLevelType;
  finderColor: string;
};

function E_04(props: PropTypes) {
  const qrModuleStyle = (
    path: ModuleStyleFunctionParams[0],
    module: ModuleStyleFunctionParams[1],
    qr: QR
  ) => {
    const { x, y, size } = module;
    if (!(qr.reservedBits[module.index]?.type === ReservedBits.FinderPattern)) {
      path.codeword += getCirclePath(x, y, size);
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
    for (let i = 0; i < positions.outer.length; i++) {
      const pos = positions.outer[i];
      path.finder += getCircleOutlinePath(pos.x, pos.y, sizes.outer);
    }
  };

  return (
    <Qr
      input={props.input}
      qrOptions={{ errorCorrection: props.errorCorrection }}
      moduleStyle={qrModuleStyle}
      onGenerated={onGenerated}
      color={{ finder: props.finderColor }}
    />
  );
}

export default E_04;
