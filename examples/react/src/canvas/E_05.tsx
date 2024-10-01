import { ErrorCorrectionLevelType, QR, ReservedBits } from "@qrgrid/core";
import { Qr } from "@qrgrid/react/canvas";

type PropTypes = {
  input: string;
  errorCorrection: ErrorCorrectionLevelType;
  finderColor: string;
};

function E_05(props: PropTypes) {
  const qrModuleStyle = (
    ctx: CanvasRenderingContext2D,
    module: { index: number; x: number; y: number; size: number },
    { reservedBits }: QR
  ) => {
    if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      ctx.fillStyle = props.finderColor;
    }
    ctx.fillRect(module.x, module.y, module.size * 0.95, module.size * 0.95);
    ctx.fillStyle = "white";
  };

  return (
    <Qr
      input={props.input}
      qrOptions={{ errorCorrection: props.errorCorrection }}
      moduleStyle={qrModuleStyle}
      image={{ src: "./vite.svg" }}
    />
  );
}

export default E_05;
