import { Component, Input } from '@angular/core';
import { ErrorCorrectionLevelType, QR, ReservedBits } from '@qrgrid/core';

import { Qr, ModuleStyleFunctionParams } from '@qrgrid/angular/src/svg'; // @qrgrid/angular/svg

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
      [color]="{ finder: this.finderColor }"
    />
  `,
  styleUrl: '../app.component.css',
})
export class E_05 {
  @Input({ required: true }) input: string = '';
  @Input({ required: true }) finderColor: string = '';
  @Input() errorCorrection!: ErrorCorrectionLevelType;

  qrModuleStyle = (
    path: ModuleStyleFunctionParams[0],
    module: ModuleStyleFunctionParams[1],
    { reservedBits }: QR,
  ) => {
    const { x, y } = module;
    const size = module.size * 0.95;
    const squarePath = `M${x} ${y}v${size}h${size}v-${size}z`;
    if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
      path.finder += squarePath;
    } else {
      path.codeword += squarePath;
    }
  };
}
