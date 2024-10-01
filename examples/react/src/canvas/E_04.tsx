import { ErrorCorrectionLevelType, QR, ReservedBits } from "@qrgrid/core";
import { Qr } from "@qrgrid/react/canvas";
import {
  drawCircle,
  drawCircleOutline,
  ModuleType,
} from "@qrgrid/styles/canvas";
import { getFinderPatternDetails } from "@qrgrid/styles/common";

type PropTypes = {
  input: string;
  errorCorrection: ErrorCorrectionLevelType;
  finderColor: string;
};

function E_04(props: PropTypes) {
  const qrModuleStyle = (
    ctx: CanvasRenderingContext2D,
    module: { index: number; x: number; y: number; size: number },
    qr: QR
  ) => {
    if (qr.reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      ctx.fillStyle = props.finderColor;
    } else {
      ctx.fillStyle = "white";
      drawCircle(ctx, module);
    }
  };

  const onGenerated = (ctx: CanvasRenderingContext2D, size: number, qr: QR) => {
    ctx.fillStyle = props.finderColor;
    const { positions, sizes } = getFinderPatternDetails(size, qr);
    for (let i = 0; i < positions.inner.length; i++) {
      const pos = positions.inner[i];
      drawCircle(ctx, { ...pos, size: sizes.inner } as ModuleType);
    }
    for (let i = 0; i < positions.outer.length; i++) {
      const pos = positions.outer[i];
      drawCircleOutline(ctx, { ...pos, size: sizes.outer } as ModuleType);
    }
  };

  return (
    <Qr
      input={props.input}
      qrOptions={{ errorCorrection: props.errorCorrection }}
      moduleStyle={qrModuleStyle}
      onGenerated={onGenerated}
    />
  );
}

export default E_04;
