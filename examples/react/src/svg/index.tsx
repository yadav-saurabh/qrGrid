import { ErrorCorrectionLevelType } from "@qrgrid/core";

import Default from "./Default";
import E_01 from "./E_01";
import E_02 from "./E_02";
import E_03 from "./E_03";
import E_04 from "./E_04";
import E_05 from "./E_05";
import E_06 from "./E_06";

type PropTypes = {
  input: string;
  errorCorrection: ErrorCorrectionLevelType;
  finderColor: string;
};

function SvgQr(props: PropTypes) {
  return (
    <>
      <Default {...props} />
      <div className="qrContainer">
        <div className="qr">
          <E_01 {...props} />
          <p>E 01</p>
        </div>
        <div className="qr">
          <E_02 {...props} />
          <p>E 02</p>
        </div>
        <div className="qr">
          <E_03 {...props} />
          <p>E 03</p>
        </div>
        <div className="qr">
          <E_04 {...props} />
          <p>E 04</p>
        </div>
        <div className="qr">
          <E_05 {...props} />
          <p>E 05</p>
        </div>
        <div className="qr">
          <E_06 {...props} />
          <p>E 06</p>
        </div>
      </div>
    </>
  );
}

export default SvgQr;
