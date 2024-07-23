import { Fragment, useState } from "react";
import { Qr } from "@zqr/react";
import {
  dotModuleStyle,
  getNeighbor,
  roundCorner,
  roundCornerFinderPattern,
} from "@zqr/react/style";
import { ReservedBits } from "@zqr/core/enums";
import { QR } from "@zqr/core";

function App() {
  const [input, setInput] = useState("");
  const [qrData, setQrData] = useState<QR | null>(null);

  const qrModuleStyleA = (
    ctx: CanvasRenderingContext2D,
    coord: { index: number; x: number; y: number },
    size: number,
    { reservedBits }: QR
  ) => {
    if (reservedBits[coord.index]?.type === ReservedBits.FinderPattern) {
      ctx.fillStyle = "#36BA98";
    }
    ctx.fillRect(coord.x, coord.y, size, size);
    ctx.fillStyle = "white";
  };

  const qrModuleStyleB = (
    ctx: CanvasRenderingContext2D,
    coord: { index: number; x: number; y: number },
    size: number,
    { data, noOfModules, reservedBits }: QR
  ) => {
    const neighbor = getNeighbor(coord.index, noOfModules, data);

    if (reservedBits[coord.index]?.type === ReservedBits.FinderPattern) {
      ctx.fillStyle = "#C73659";
      if (!neighbor.top && !neighbor.right) {
        roundCorner(ctx, coord, size, "top-right");
        return;
      }
      if (!neighbor.bottom && !neighbor.left) {
        roundCorner(ctx, coord, size, "bottom-left");
        return;
      }
      ctx.fillRect(coord.x, coord.y, size, size);
      return;
    }
    ctx.fillStyle = "#7E8EF1";
    dotModuleStyle(ctx, coord, size);
  };

  const qrTheme = (ctx: CanvasRenderingContext2D) => {
    const { height, width } = ctx.canvas;
    // Create linear gradient
    const grad = ctx.createLinearGradient(0, 0, height, width);
    grad.addColorStop(0, "lightblue");
    grad.addColorStop(1, "darkblue");

    // Fill rectangle with gradient
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, height, width);

    // Change the fill style that will be applied to modules
    ctx.fillStyle = "white";
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
                <b>{d.mode}</b> -<span>{d.value}</span>
                <br />
              </Fragment>
            ))}
          </span>
        </div>
        <Qr
          input={input}
          getQrData={(qr) => {
            setQrData(qr);
          }}
        />
      </div>
      {/* ========== module style ========== */}
      <div className="qrContainer">
        <div className="qr">
          <Qr input={input} moduleStyle={dotModuleStyle} />
          <p>ModuleStyle:- styles/dotModuleStyle</p>
        </div>
        <div className="qr">
          <Qr input={input} moduleStyle={roundCornerFinderPattern} />
          <p>ModuleStyle:- styles/roundCornerFinderPattern</p>
        </div>
        <div className="qr">
          <Qr input={input} moduleStyle={qrModuleStyleA} />
          <p>ModuleStyle:- Custom qrModuleStyleA</p>
        </div>
        <div className="qr">
          <Qr input={input} moduleStyle={qrModuleStyleB} />
          <p>ModuleStyle:- Custom qrModuleStyleB</p>
        </div>
        {/* ======= theme and color ======== */}
        <div className="qr">
          <Qr input={input} bgColor="white" color="black" />
          <p>BgColor:- white Color:- black</p>
        </div>
        <div className="qr">
          <Qr input={input} bgColor="#F8EDED" color="#173B45" />
          <p>BgColor:- #FF7D29 Color:- #173B45</p>
        </div>
        <div className="qr">
          <Qr input={input} theme={qrTheme} />
          <p>BgColor,Color:- Custom Theme</p>
        </div>
      </div>
    </div>
  );
}

export default App;
