import { Component, Input, ViewChild } from '@angular/core';
import { ErrorCorrectionLevelType, QR, ReservedBits } from '@qrgrid/core';

import { Qr } from '@qrgrid/angular/src/canvas'; // @qrgrid/angular/canvas
import {
  getFinderPatternDetails,
  isOuterFinderPattern,
} from '../../../../../packages/styles/src/common'; // @qrgrid/angular/common
import {
  drawCircle,
  ModuleType,
} from '../../../../../packages/styles/src/canvas'; // @qrgrid/angular/canvas

type OnQrRenderedEventType = {
  ctx: CanvasRenderingContext2D;
  size: number;
  qr: QR;
};

@Component({
  selector: 'E_06',
  standalone: true,
  imports: [Qr],
  template: `
    <qr
      [input]="input"
      [qrOptions]="{ errorCorrection: this.errorCorrection }"
      [moduleStyle]="qrModuleStyle"
      (onQrRendered)="onGenerated($event)"
      [image]="{ src: './favicon.ico', overlap: false }"
    />
  `,
  styleUrl: '../app.component.css',
})
export class E_06 {
  @Input({ required: true }) input: string = '';
  @Input({ required: true }) finderColor: string = '';
  @Input() errorCorrection!: ErrorCorrectionLevelType;
  @ViewChild(Qr) canvasQr!: Qr;

  qrModuleStyle = (
    ctx: CanvasRenderingContext2D,
    module: { index: number; x: number; y: number; size: number },
    qr: QR,
  ) => {
    const { reservedBits } = qr;
    if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      ctx.fillStyle = this.finderColor;
      if (isOuterFinderPattern(module.index, qr)) {
        ctx.fillRect(module.x, module.y, module.size, module.size);
      }
    } else {
      ctx.fillRect(module.x, module.y, module.size * 0.95, module.size * 0.95);
    }
    ctx.fillStyle = 'white';
  };

  onGenerated({ ctx, size, qr }: OnQrRenderedEventType) {
    ctx.fillStyle = this.finderColor;
    const { positions, sizes } = getFinderPatternDetails(size, qr);
    for (let i = 0; i < positions.inner.length; i++) {
      const pos = positions.inner[i];
      drawCircle(ctx, { ...pos, size: sizes.inner } as ModuleType);
    }
  }
}
