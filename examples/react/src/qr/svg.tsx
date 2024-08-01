import { Fragment, useRef, useState } from "react";
import { QR, ErrorCorrectionLevelType } from "@qrgrid/core";
import { Qr } from "@qrgrid/react/svg";
import { downloadQr as downloadUtil } from "@qrgrid/react/svg/utils";
import { dotModuleStyle } from "@qrgrid/react/svg/styles";

type PropTypes = {
  input: string;
  errorCorrection: ErrorCorrectionLevelType;
};

function SvgQr({ input, errorCorrection }: PropTypes) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [qrData, setQrData] = useState<QR | null>(null);

  const download = () => {
    if (svgRef.current) {
      downloadUtil(svgRef.current);
    }
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
          ref={svgRef}
          getQrData={setQrData}
        />
      </div>
      <div className="qrContainer">
        <div className="qr">
          <Qr
            input={input}
            qrOptions={{ errorCorrection }}
            moduleStyle={dotModuleStyle}
            getQrData={(qr) => {
              setQrData(qr);
            }}
          />
          <p>ModuleStyle:- styles/dotModuleStyle</p>
        </div>
        <div className="qr">
          <Qr
            input={input}
            qrOptions={{ errorCorrection }}
            image={{ src: "./vite.svg" }}
          />
          <p>image:- with image in between</p>
        </div>
      </div>
    </>
  );
}

export default SvgQr;
