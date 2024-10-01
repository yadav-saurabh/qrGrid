import { Fragment, useRef, useState } from "react";
import { QR, ErrorCorrectionLevelType } from "@qrgrid/core";
import { Qr } from "@qrgrid/react/canvas";
import { downloadQr as downloadUtil } from "@qrgrid/styles/canvas/utils";

type PropTypes = {
  input: string;
  errorCorrection: ErrorCorrectionLevelType;
};

function Default({ input, errorCorrection }: PropTypes) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [qrData, setQrData] = useState<QR | null>(null);

  const download = () => {
    if (canvasRef.current) {
      downloadUtil(canvasRef.current);
    }
  };

  return (
    <div className="defaultQrContainer">
      <div style={{ position: "relative", left: "-4rem" }}>
        <h2>Default Qr</h2>
        Version: {qrData?.version || 0}
        <br />
        Size: {qrData?.gridSize || 0}
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
  );
}

export default Default;
