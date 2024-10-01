import { useState } from "react";
import { ErrorCorrectionLevel, ErrorCorrectionLevelType } from "@qrgrid/core";

import CanvasQr from "./canvas";
import SvgQr from "./svg";


const FINDER_COLOR = "#ff3131";

function App() {
  const [input, setInput] = useState("");
  const [errorCorrection, setErrorCorrection] =
    useState<ErrorCorrectionLevelType>(ErrorCorrectionLevel.M);

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
            setErrorCorrection(e.target.value as ErrorCorrectionLevelType)
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

      <h2 style={{ margin: "2rem", borderBottom: "1px solid" }}>
        Using Canvas
      </h2>
      <CanvasQr input={input} finderColor={FINDER_COLOR} errorCorrection={errorCorrection} />

      <h2 style={{ margin: "2rem", borderBottom: "1px solid" }}>Using Svg</h2>
      <SvgQr input={input} finderColor={FINDER_COLOR} errorCorrection={errorCorrection} />
    </div>
  );
}

export default App;
