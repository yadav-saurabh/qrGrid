import { Fragment, useRef, useState } from "react";
import { QR, ErrorCorrectionLevelType, ReservedBits } from "@qrgrid/core";
import { ModuleStyleFunctionParams, Qr } from "@qrgrid/react/svg";
import {
  downloadQr as downloadUtil,
  getCirclePath,
  getNeighbor,
  getRoundCornerPath,
  getSquarePath,
} from "@qrgrid/styles/svg/utils";
import { dotModuleStyle, smoothModuleStyle } from "@qrgrid/styles/svg/styles";

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

  const qrModuleStyle = (
    path: ModuleStyleFunctionParams[0],
    module: ModuleStyleFunctionParams[1],
    qr: QR
  ) => {
    const { reservedBits } = qr;
    const { x, y, size } = module;
    const neighbor = getNeighbor(module.index, qr);

    if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      if (!neighbor.top && !neighbor.right) {
        path.finder += getRoundCornerPath(module, ["top-right"], size);
        return;
      }
      if (!neighbor.bottom && !neighbor.left) {
        path.finder += getRoundCornerPath(module, ["bottom-left"], size);
        return;
      }
      path.finder += getSquarePath(x, y, size);
      return;
    }
    path.codeword += getCirclePath(x, y, size);
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
        {/* module style */}
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
            moduleStyle={qrModuleStyle}
            color={{ finder: "#C73659", codeword: "#7E8EF1" }}
          />
          <p>ModuleStyle:- custom qrModuleStyle</p>
        </div>
        {/* color */}
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
            bgColor="white"
            color={{ finder: "#36BA98", codeword: "#173B45" }}
          />
          <p>
            BgColor:- white <br /> Color:- finder: "#36BA98" codeword: "#173B45"
          </p>
        </div>
        {/* image */}
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
