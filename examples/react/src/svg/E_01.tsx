import { ErrorCorrectionLevelType } from "@qrgrid/core";
import { Qr } from "@qrgrid/react/svg";

type PropTypes = {
  input: string;
  errorCorrection: ErrorCorrectionLevelType;
  finderColor: string;
};

function E_01(props: PropTypes) {
  return (
    <Qr
      input={props.input}
      qrOptions={{ errorCorrection: props.errorCorrection }}
      color={{ finder: props.finderColor }}
    />
  );
}

export default E_01;
