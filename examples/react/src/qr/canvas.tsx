import { Fragment, useRef, useState } from "react";
import { QR, ReservedBits, ErrorCorrectionLevelType } from "@qrgrid/core";
import { Qr } from "@qrgrid/react/canvas";
import { dotModuleStyle, smoothModuleStyle } from "@qrgrid/styles/canvas/styles";
import {
  downloadQr as downloadUtil,
  getNeighbor,
  roundCorner,
} from "@qrgrid/styles/canvas/utils";

type PropTypes = {
  input: string;
  errorCorrection: ErrorCorrectionLevelType;
};

function CanvasQr({ input, errorCorrection }: PropTypes) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [qrData, setQrData] = useState<QR | null>(null);

  const download = () => {
    if (canvasRef.current) {
      downloadUtil(canvasRef.current);
    }
  };

  const qrModuleStyleA = (
    ctx: CanvasRenderingContext2D,
    module: { index: number; x: number; y: number; size: number },
    { reservedBits }: QR
  ) => {
    if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      ctx.fillStyle = "#36BA98";
    }
    ctx.fillRect(module.x, module.y, module.size, module.size);
    ctx.fillStyle = "white";
  };

  const qrModuleStyleB = (
    ctx: CanvasRenderingContext2D,
    module: { index: number; x: number; y: number; size: number },
    qr: QR
  ) => {
    const { reservedBits } = qr;
    const neighbor = getNeighbor(module.index, qr);

    if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      ctx.fillStyle = "#C73659";
      if (!neighbor.top && !neighbor.right) {
        roundCorner(ctx, module, ["top-right"]);
        return;
      }
      if (!neighbor.bottom && !neighbor.left) {
        roundCorner(ctx, module, ["bottom-left"]);
        return;
      }
      ctx.fillRect(module.x, module.y, module.size, module.size);
      return;
    }
    ctx.fillStyle = "#7E8EF1";
    dotModuleStyle(ctx, module);
  };

  return (
    <>
      {/* ====== default codes ====== */}
      <div className="defaultQrContainer">
        <div style={{ position: "relative", left: "-4rem" }}>
          <h2>Default Qr</h2>
          Version: {qrData?.version || 0}
          <br />
          Size: {qrData?.noOfModules || 0}
          <br />
          Error Correction: {qrData?.errorCorrection || "N.A"}
          <br />
          Total bits size: {(qrData?.data || []).length}
          <br />
          Reserved bits length: {Object.keys(qrData?.reservedBits || {}).length}
          <br />
          Segments:
          <br />
          <span className="segments">
            {(qrData?.segments || []).map((d, i) => (
              <Fragment key={i}>
                <b>{d.mode}</b> - <span>{d.value}</span>
                <br />
              </Fragment>
            ))}
          </span>
          <div>
            <button type="button" onClick={download}>
              Download
            </button>
          </div>
        </div>
        <Qr
          input={input}
          qrOptions={{ errorCorrection }}
          ref={canvasRef}
          getQrData={setQrData}
        />
      </div>
      {/* ========== module style ========== */}
      <div className="qrContainer">
        <div className="qr">
          <Qr
            input={input}
            qrOptions={{ errorCorrection }}
            moduleStyle={dotModuleStyle}
          />
          <p>ModuleStyle:- styles/dotModuleStyle</p>
        </div>
        <div className="qr">
          <Qr
            input={input}
            qrOptions={{ errorCorrection }}
            moduleStyle={smoothModuleStyle}
          />
          <p>ModuleStyle:- styles/smoothModuleStyle</p>
        </div>
        <div className="qr">
          <Qr
            input={input}
            qrOptions={{ errorCorrection }}
            moduleStyle={qrModuleStyleA}
          />
          <p>ModuleStyle:- Custom qrModuleStyleA</p>
        </div>
        <div className="qr">
          <Qr
            input={input}
            qrOptions={{ errorCorrection }}
            moduleStyle={qrModuleStyleB}
          />
          <p>ModuleStyle:- Custom qrModuleStyleB</p>
        </div>
        {/* ======= theme and color ======== */}
        <div className="qr">
          <Qr
            input={input}
            qrOptions={{ errorCorrection }}
            bgColor="white"
            color="black"
          />
          <p>BgColor:- white Color:- black</p>
        </div>
        <div className="qr">
          <Qr
            input={input}
            qrOptions={{ errorCorrection }}
            bgColor="#F8EDED"
            color="#173B45"
          />
          <p>BgColor:- #F8EDED Color:- #173B45</p>
        </div>
        <div className="qr">
          <Qr
            input={input}
            qrOptions={{ errorCorrection }}
            moduleStyle={smoothModuleStyle}
            bgColor={(ctx) => {
              const { height, width } = ctx.canvas;
              const grad = ctx.createLinearGradient(0, 0, height, width);
              grad.addColorStop(0, "lightblue");
              grad.addColorStop(1, "darkblue");
              return grad;
            }}
          />
          <p>BgColor,Color:- Custom Theme</p>
        </div>
        {/* ======= image ======== */}
        <div className="qr">
          <Qr
            input={input}
            qrOptions={{ errorCorrection }}
            moduleStyle={qrModuleStyleA}
            image={{ src: "./vite.svg" }}
          />
          <p>image:- with image in between</p>
        </div>
      </div>
    </>
  );
}

export default CanvasQr;
