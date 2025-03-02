import { QR } from "@qrgrid/core";

import { generateDefaultQr } from "./default";
import { E_01 } from "./E_01";
import { E_02 } from "./E_02";
import { E_03 } from "./E_03";
import { E_04 } from "./E_04";
import { E_05 } from "./E_05";
import { E_06 } from "./E_06";

export function generateSvg(qr: QR) {
  generateDefaultQr(qr);
  E_01(qr);
  E_02(qr);
  E_03(qr);
  E_04(qr);
  E_05(qr);
  E_06(qr);
}
