import { ErrorCorrectionLevelType, QR, ReservedBits } from "@qrgrid/core";
import { Qr } from "@qrgrid/react/canvas";
import { drawSmoothEdges } from "@qrgrid/styles/canvas";

type PropTypes = {
  input: string;
  errorCorrection: ErrorCorrectionLevelType;
  finderColor: string;
};

function E_02(props: PropTypes) {
  const qrModuleStyle = (
    ctx: CanvasRenderingContext2D,
    module: { index: number; x: number; y: number; size: number },
    qr: QR
  ) => {
    if (qr.reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      ctx.fillStyle = props.finderColor;
    } else {
      ctx.fillStyle = "white";
    }
    drawSmoothEdges(ctx, module, qr);
  };

  return (
    <Qr
      input={props.input}
      qrOptions={{ errorCorrection: props.errorCorrection }}
      moduleStyle={qrModuleStyle}
    />
  );
}

export default E_02;
