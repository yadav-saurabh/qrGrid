import { Component, Input } from '@angular/core';
import { ErrorCorrectionLevelType, QR, ReservedBits } from '@qrgrid/core';

import { Qr, ModuleStyleFunctionParams } from '@qrgrid/angular/src/svg'; // @qrgrid/angular/svg
import {
  getFinderPatternDetails,
  isOuterFinderPattern,
} from '../../../../../packages/styles/src/common'; // @qrgrid/angular/common
import {
  getCirclePath,
  getSquarePath,
} from '../../../../../packages/styles/src/svg'; // @qrgrid/angular/svg

@Component({
  selector: 'E_06',
  standalone: true,
  imports: [Qr],
  template: `
    <qr
      [input]="input"
      [qrOptions]="{ errorCorrection: this.errorCorrection }"
      [moduleStyle]="qrModuleStyle"
      [moduleStyle]="qrModuleStyle"
      [generated]="onGenerated"
      [image]="{ src: './favicon.ico', overlap: false }"
      [color]="{ finder: this.finderColor }"
    />
  `,
  styleUrl: '../app.component.css',
})
export class E_06 {
  @Input({ required: true }) input: string = '';
  @Input({ required: true }) finderColor: string = '';
  @Input() errorCorrection!: ErrorCorrectionLevelType;

  qrModuleStyle = (
    path: ModuleStyleFunctionParams[0],
    module: ModuleStyleFunctionParams[1],
    qr: QR,
  ) => {
    const { reservedBits } = qr;
    const { x, y } = module;
    if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      if (isOuterFinderPattern(module.index, qr)) {
        path.finder += getSquarePath(x, y, module.size);
      }
    } else {
      const size = module.size * 0.95;
      const squarePath = `M${x} ${y}v${size}h${size}v-${size}z`;
      path.codeword += squarePath;
    }
  };

  onGenerated = (path: ModuleStyleFunctionParams[0], size: number, qr: QR) => {
    const { positions, sizes } = getFinderPatternDetails(size, qr);
    for (let i = 0; i < positions.inner.length; i++) {
      const pos = positions.inner[i];
      path.finder += getCirclePath(pos.x, pos.y, sizes.inner);
    }
  };
}
