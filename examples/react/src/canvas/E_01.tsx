import { ErrorCorrectionLevelType, QR, ReservedBits } from "@qrgrid/core";
import { Qr } from "@qrgrid/react/canvas";

type PropTypes = {
  input: string;
  errorCorrection: ErrorCorrectionLevelType;
  finderColor: string;
};

function E_01(props: PropTypes) {
  const qrModuleStyle = (
    ctx: CanvasRenderingContext2D,
    module: { index: number; x: number; y: number; size: number },
    { reservedBits }: QR
  ) => {
    if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      ctx.fillStyle = props.finderColor;
    }
    ctx.fillRect(module.x, module.y, module.size, module.size);
    ctx.fillStyle = "white";
  };

  return (
    <Qr
      input={props.input}
      qrOptions={{ errorCorrection: props.errorCorrection }}
      moduleStyle={qrModuleStyle}
    />
  );
}

export default E_01;
