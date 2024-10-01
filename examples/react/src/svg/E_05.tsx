import { ErrorCorrectionLevelType, QR, ReservedBits } from "@qrgrid/core";
import { Qr, ModuleStyleFunctionParams } from "@qrgrid/react/svg";

type PropTypes = {
  input: string;
  errorCorrection: ErrorCorrectionLevelType;
  finderColor: string;
};

function E_05(props: PropTypes) {
  const qrModuleStyle = (
    path: ModuleStyleFunctionParams[0],
    module: ModuleStyleFunctionParams[1],
    { reservedBits }: QR
  ) => {
    const { x, y } = module;
    const size = module.size * 0.95;
    const squarePath = `M${x} ${y}v${size}h${size}v-${size}z`;
    if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      path.finder += squarePath;
    } else {
      path.codeword += squarePath;
    }
  };

  return (
    <Qr
      input={props.input}
      qrOptions={{ errorCorrection: props.errorCorrection }}
      moduleStyle={qrModuleStyle}
      color={{ finder: props.finderColor }}
      image={{ src: "./vite.svg" }}
    />
  );
}

export default E_05;
