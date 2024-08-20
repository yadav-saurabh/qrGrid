import { Component, Input, ViewChild } from '@angular/core';
import { ErrorCorrectionLevelType, QR, ReservedBits } from '@qrgrid/core';

import {
  dotModuleStyle,
  smoothModuleStyle,
  downloadQr,
  getNeighbor,
  getRoundCornerPath,
  getCornerArcPath,
  getSquarePath,
  getCirclePath,
} from '../../../../../packages/styles/src/svg'; // @qrgrid/styles/svg
import {
  ModuleStyleFunctionParams,
  Qr,
} from '../../../../../packages/angular/src/svg/qr.component'; // @qrgrid/angular/svg

@Component({
  selector: 'app-svg',
  standalone: true,
  imports: [Qr],
  templateUrl: './svg.component.html',
  styleUrl: '../app.component.css',
})
export class SvgComponent {
  @Input({ required: true }) input: string = '';
  @Input() errorCorrection!: ErrorCorrectionLevelType;
  @ViewChild(Qr) svgQr!: Qr;

  qrData?: QR;
  dotModuleStyle = dotModuleStyle;
  smoothModuleStyle = smoothModuleStyle;

  getReservedBitsLength() {
    Object.keys(this.qrData?.reservedBits || {}).length;
  }

  onQrDataEncoded(qr: QR) {
    this.qrData = qr;
  }

  customModuleStyle(
    path: ModuleStyleFunctionParams[0],
    module: ModuleStyleFunctionParams[1],
    qr: QR,
  ) {
    const { reservedBits } = qr;
    const { x, y, size } = module;
    const neighbor = getNeighbor(module.index, qr);
    const cornerDist = size * 0.9;

    if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      if (!neighbor.top && !neighbor.left) {
        path.finder += getRoundCornerPath(module, ['top-left'], cornerDist);
        if (!neighbor.bottomRight) {
          const arcCoords = { ...module, y: y + size, x: x + size };
          path.finder += getCornerArcPath(arcCoords, 'top-left', cornerDist);
        }
        return;
      }
      if (!neighbor.bottom && !neighbor.right) {
        path.finder += getRoundCornerPath(module, ['bottom-right']);
        if (!neighbor.topLeft) {
          path.finder += getCornerArcPath(module, 'bottom-right', cornerDist);
        }
        return;
      }
      path.finder += getSquarePath(x, y, size);
      return;
    }
    path.codeword += getCirclePath(x, y, size);
  }

  download() {
    if (this.svgQr?.svg?.nativeElement) {
      downloadQr(this.svgQr.svg.nativeElement);
    }
  }
}
