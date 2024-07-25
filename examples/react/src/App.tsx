import { Fragment, useRef, useState } from "react";
import { QR, ErrorCorrectionLevel, ReservedBits } from "@zqr/core";
import { Qr } from "@zqr/react/canvas";
import { dotModuleStyle, smoothModuleStyle } from "@zqr/react/canvas/styles";
import {
  downloadQr as downloadUtil,
  getNeighbor,
  roundCorner,
} from "@zqr/react/canvas/utils";

function App() {
  const [input, setInput] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>(
    ErrorCorrectionLevel.M
  );
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
    <div>
      <div className="inputContainer">
        <textarea
          placeholder="Text To Encode"
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          cols={50}
        />
        <select
          name="errorCorrection"
          id="errorCorrection"
          defaultValue={ErrorCorrectionLevel.M}
          onChange={(e) =>
            setErrorCorrection(e.target.value as ErrorCorrectionLevel)
          }
        >
          <option disabled>Choose a ErrorCorrectionLevel</option>
          {Object.keys(ErrorCorrectionLevel).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      {/* ====== qr codes ====== */}
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
          getQrData={(qr) => {
            setQrData(qr);
          }}
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
          <p>BgColor:- #FF7D29 Color:- #173B45</p>
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
      </div>
    </div>
  );
}

export default App;
