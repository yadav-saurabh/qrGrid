import { Component, Input, ViewChild } from '@angular/core';
import { ErrorCorrectionLevelType, QR, ReservedBits } from '@qrgrid/core';

import {
  dotModuleStyle,
  smoothModuleStyle,
  downloadQr,
} from '../../../../../packages/styles/src/canvas'; // @qrgrid/styles/canvas
import {
  ModuleStyleFunctionParams,
  Qr,
} from '../../../../../packages/angular/src/canvas/qr.component'; // @qrgrid/angular/canvas

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [Qr],
  templateUrl: './canvas.component.html',
  styleUrl: '../app.component.css',
})
export class CanvasComponent {
  @Input({ required: true }) input: string = '';
  @Input() errorCorrection!: ErrorCorrectionLevelType;
  @ViewChild(Qr) canvasQr!: Qr;

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
    ctx: ModuleStyleFunctionParams[0],
    module: ModuleStyleFunctionParams[1],
    qr: QR,
  ) {
    const { x, y, size, index } = module;
    if (qr.reservedBits[index]?.type === ReservedBits.FinderPattern) {
      ctx.fillStyle = '#36BA98';
    }
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = 'white';
  }

  download() {
    if (this.canvasQr?.canvas?.nativeElement) {
      downloadQr(this.canvasQr.canvas.nativeElement);
    }
  }
}
