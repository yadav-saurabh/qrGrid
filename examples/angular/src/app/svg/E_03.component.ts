import { Component, Input } from '@angular/core';
import { ErrorCorrectionLevelType, QR, ReservedBits } from '@qrgrid/core';

import { ModuleStyleFunctionParams, Qr } from '@qrgrid/angular/src/svg'; // @qrgrid/angular/svg
import { getCirclePath } from '../../../../../packages/styles/src/svg'; // @qrgrid/styles/svg

@Component({
  selector: 'E_03',
  standalone: true,
  imports: [Qr],
  template: `
    <qr
      [input]="input"
      [qrOptions]="{ errorCorrection: this.errorCorrection }"
      [moduleStyle]="qrModuleStyle"
      [color]="{ finder: this.finderColor }"
    />
  `,
  styleUrl: '../app.component.css',
})
export class E_03 {
  @Input({ required: true }) input: string = '';
  @Input({ required: true }) finderColor: string = '';
  @Input() errorCorrection!: ErrorCorrectionLevelType;

  qrModuleStyle = (
    path: ModuleStyleFunctionParams[0],
    module: ModuleStyleFunctionParams[1],
    qr: QR,
  ) => {
    const { x, y, size } = module;
    if (qr.reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      path.finder += getCirclePath(x, y, size);
    } else {
      path.codeword += getCirclePath(x, y, size);
    }
  };
}
