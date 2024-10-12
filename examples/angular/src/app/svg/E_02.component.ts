import { Component, Input } from '@angular/core';
import { ErrorCorrectionLevelType, QR, ReservedBits } from '@qrgrid/core';

import { ModuleStyleFunctionParams, Qr } from '@qrgrid/angular/src/svg'; // @qrgrid/angular/svg
import { getSmoothEdgesPath } from '../../../../../packages/styles/src/svg'; // @qrgrid/angular/svg

@Component({
  selector: 'E_02',
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
export class E_02 {
  @Input({ required: true }) input: string = '';
  @Input({ required: true }) finderColor: string = '';
  @Input() errorCorrection!: ErrorCorrectionLevelType;

  qrModuleStyle = (
    path: ModuleStyleFunctionParams[0],
    module: ModuleStyleFunctionParams[1],
    qr: QR,
  ) => {
    if (qr.reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      path.finder += getSmoothEdgesPath(module, qr);
    } else {
      path.codeword += getSmoothEdgesPath(module, qr);
    }
  };
}
