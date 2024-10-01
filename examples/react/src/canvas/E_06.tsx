import { ErrorCorrectionLevelType, QR, ReservedBits } from "@qrgrid/core";
import { Qr } from "@qrgrid/react/canvas";
import { drawCircle, ModuleType } from "@qrgrid/styles/canvas";
import {
  getFinderPatternDetails,
  isOuterFinderPattern,
} from "@qrgrid/styles/common";

type PropTypes = {
  input: string;
  errorCorrection: ErrorCorrectionLevelType;
  finderColor: string;
};

function E_06(props: PropTypes) {
  const qrModuleStyle = (
    ctx: CanvasRenderingContext2D,
    module: { index: number; x: number; y: number; size: number },
    qr: QR
  ) => {
    const { reservedBits } = qr;
    if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      ctx.fillStyle = props.finderColor;
      if (isOuterFinderPattern(module.index, qr)) {
        ctx.fillRect(module.x, module.y, module.size, module.size);
      }
    } else {
      ctx.fillRect(module.x, module.y, module.size * 0.95, module.size * 0.95);
    }
    ctx.fillStyle = "white";
  };

  const onGenerated = (ctx: CanvasRenderingContext2D, size: number, qr: QR) => {
    ctx.fillStyle = props.finderColor;
    const { positions, sizes } = getFinderPatternDetails(size, qr);
    for (let i = 0; i < positions.inner.length; i++) {
      const pos = positions.inner[i];
      drawCircle(ctx, { ...pos, size: sizes.inner } as ModuleType);
    }
  };

  return (
    <Qr
      input={props.input}
      qrOptions={{ errorCorrection: props.errorCorrection }}
      moduleStyle={qrModuleStyle}
      onGenerated={onGenerated}
      image={{ src: "./vite.svg", overlap: false }}
    />
  );
}

export default E_06;
