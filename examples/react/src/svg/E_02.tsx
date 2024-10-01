import { ErrorCorrectionLevelType, QR, ReservedBits } from "@qrgrid/core";
import { Qr, ModuleStyleFunctionParams } from "@qrgrid/react/svg";
import { getSmoothEdgesPath } from "@qrgrid/styles/svg";

type PropTypes = {
  input: string;
  errorCorrection: ErrorCorrectionLevelType;
  finderColor: string;
};

function E_02(props: PropTypes) {
  const qrModuleStyle = (
    path: ModuleStyleFunctionParams[0],
    module: ModuleStyleFunctionParams[1],
    qr: QR
  ) => {
    if (qr.reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      path.finder += getSmoothEdgesPath(module, qr);
    } else {
      path.codeword += getSmoothEdgesPath(module, qr);
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

export default E_02;
