import { Component, Input } from '@angular/core';
import { ErrorCorrectionLevelType } from '@qrgrid/core';

import { Qr } from '@qrgrid/angular/src/svg'; // @qrgrid/angular/svg

@Component({
  selector: 'E_01',
  standalone: true,
  imports: [Qr],
  template: `
    <qr
      [input]="input"
      [qrOptions]="{ errorCorrection: this.errorCorrection }"
      [color]="{ finder: this.finderColor }"
    />
  `,
  styleUrl: '../app.component.css',
})
export class E_01 {
  @Input({ required: true }) input: string = '';
  @Input({ required: true }) finderColor: string = '';
  @Input() errorCorrection!: ErrorCorrectionLevelType;
}
