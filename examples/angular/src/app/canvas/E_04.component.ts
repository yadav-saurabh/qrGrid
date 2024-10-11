import { Component, Input, ViewChild } from '@angular/core';
import { ErrorCorrectionLevelType, QR, ReservedBits } from '@qrgrid/core';

import { Qr } from '@qrgrid/angular/src/canvas'; // @qrgrid/angular/canvas
import {
  drawCircle,
  drawCircleOutline,
  ModuleType,
} from '../../../../../packages/styles/src/canvas'; // @qrgrid/styles/canvas
import { getFinderPatternDetails } from '../../../../../packages/styles/src/common'; // @qrgrid/styles/common

type OnQrRenderedEventType = {
  ctx: CanvasRenderingContext2D;
  size: number;
  qr: QR;
};

@Component({
  selector: 'E_04',
  standalone: true,
  imports: [Qr],
  template: `
    <qr
      [input]="input"
      [qrOptions]="{ errorCorrection: this.errorCorrection }"
      [moduleStyle]="qrModuleStyle"
      (onQrRendered)="onGenerated($event)"
    />
  `,
  styleUrl: '../app.component.css',
})
export class E_04 {
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
      drawCircle(ctx, module);
    }
  };

  onGenerated({ ctx, size, qr }: OnQrRenderedEventType) {
    ctx.fillStyle = this.finderColor;
    const { positions, sizes } = getFinderPatternDetails(size, qr);
    for (let i = 0; i < positions.inner.length; i++) {
      const pos = positions.inner[i];
      drawCircle(ctx, { ...pos, size: sizes.inner } as ModuleType);
    }
    for (let i = 0; i < positions.outer.length; i++) {
      const pos = positions.outer[i];
      drawCircleOutline(ctx, { ...pos, size: sizes.outer } as ModuleType);
    }
  }
}
