import { Component, Input } from '@angular/core';
import { ErrorCorrectionLevelType, QR, ReservedBits } from '@qrgrid/core';

import { ModuleStyleFunctionParams, Qr } from '@qrgrid/angular/src/svg'; // @qrgrid/angular/svg
import {
  getCircleOutlinePath,
  getCirclePath,
} from '../../../../../packages/styles/src/svg'; // @qrgrid/styles/svg
import { getFinderPatternDetails } from '../../../../../packages/styles/src/common'; // @qrgrid/styles/common

type OnQrRenderedEventType = {
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
      [generated]="onGenerated"
      [color]="{ finder: this.finderColor }"
    />
  `,
  styleUrl: '../app.component.css',
})
export class E_04 {
  @Input({ required: true }) input: string = '';
  @Input({ required: true }) finderColor: string = '';
  @Input() errorCorrection!: ErrorCorrectionLevelType;

  qrModuleStyle = (
    path: ModuleStyleFunctionParams[0],
    module: ModuleStyleFunctionParams[1],
    qr: QR,
  ) => {
    const { x, y, size } = module;
    if (!(qr.reservedBits[module.index]?.type === ReservedBits.FinderPattern)) {
      path.codeword += getCirclePath(x, y, size);
    }
  };

  onGenerated = (path: ModuleStyleFunctionParams[0], size: number, qr: QR) => {
    const { positions, sizes } = getFinderPatternDetails(size, qr);
    for (let i = 0; i < positions.inner.length; i++) {
      const pos = positions.inner[i];
      path.finder += getCirclePath(pos.x, pos.y, sizes.inner);
    }
    for (let i = 0; i < positions.outer.length; i++) {
      const pos = positions.outer[i];
      path.finder += getCircleOutlinePath(pos.x, pos.y, sizes.outer);
    }
  };
}
