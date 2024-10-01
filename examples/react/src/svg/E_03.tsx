import { ErrorCorrectionLevelType, QR, ReservedBits } from "@qrgrid/core";
import { Qr, ModuleStyleFunctionParams } from "@qrgrid/react/svg";
import { getCirclePath } from "@qrgrid/styles/svg";

type PropTypes = {
  input: string;
  errorCorrection: ErrorCorrectionLevelType;
  finderColor: string;
};

function E_03(props: PropTypes) {
  const qrModuleStyle = (
    path: ModuleStyleFunctionParams[0],
    module: ModuleStyleFunctionParams[1],
    qr: QR
  ) => {
    const { x, y, size } = module;
    if (qr.reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      path.finder += getCirclePath(x, y, size);
    } else {
      path.codeword += getCirclePath(x, y, size);
    }
  };

  return (
    <Qr
      input={props.input}
      qrOptions={{ errorCorrection: props.errorCorrection }}
      moduleStyle={qrModuleStyle}
      color={{ finder: props.finderColor }}
    />
  );
}

export default E_03;
