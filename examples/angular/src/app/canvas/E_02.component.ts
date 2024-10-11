import { Component, Input, ViewChild } from '@angular/core';
import { ErrorCorrectionLevelType, QR, ReservedBits } from '@qrgrid/core';

import { Qr } from '@qrgrid/angular/src/canvas'; // @qrgrid/angular/canvas
import { drawSmoothEdges } from '../../../../../packages/styles/src/canvas'; // @qrgrid/styles/canvas

@Component({
  selector: 'E_02',
  standalone: true,
  imports: [Qr],
  template: `
    <qr
      [input]="input"
      [qrOptions]="{ errorCorrection: this.errorCorrection }"
      [moduleStyle]="qrModuleStyle"
    />
  `,
  styleUrl: '../app.component.css',
})
export class E_02 {
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
    } else {
      ctx.fillStyle = 'white';
    }
    drawSmoothEdges(ctx, module, qr);
  };
}
