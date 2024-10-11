import { Component, Input, ViewChild } from '@angular/core';
import { ErrorCorrectionLevelType, QR, ReservedBits } from '@qrgrid/core';

import { Qr } from '@qrgrid/angular/src/canvas'; // @qrgrid/angular/canvas

@Component({
  selector: 'E_05',
  standalone: true,
  imports: [Qr],
  template: `
    <qr
      [input]="input"
      [qrOptions]="{ errorCorrection: this.errorCorrection }"
      [moduleStyle]="qrModuleStyle"
      [image]="{ src: './favicon.ico' }"
    />
  `,
  styleUrl: '../app.component.css',
})
export class E_05 {
  @Input({ required: true }) input: string = '';
  @Input({ required: true }) finderColor: string = '';
  @Input() errorCorrection!: ErrorCorrectionLevelType;
  @ViewChild(Qr) canvasQr!: Qr;

  qrModuleStyle = (
    ctx: CanvasRenderingContext2D,
    module: { index: number; x: number; y: number; size: number },
    qr: QR,
  ) => {
    if (qr.reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      ctx.fillStyle = this.finderColor;
    }
    ctx.fillRect(module.x, module.y, module.size * 0.95, module.size * 0.95);
    ctx.fillStyle = 'white';
  };
}
