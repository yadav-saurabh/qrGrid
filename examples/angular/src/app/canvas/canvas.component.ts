import { Component, Input } from '@angular/core';
import { ErrorCorrectionLevelType } from '@qrgrid/core';

import { Qr } from '@qrgrid/angular/src/canvas'; // @qrgrid/angular/canvas

import { Default } from './Default.component';
import { E_01 } from './E_01.component';
import { E_02 } from "./E_02.component";
import { E_03 } from "./E_03.component";
import { E_04 } from "./E_04.component";
import { E_05 } from "./E_05.component";
import { E_06 } from "./E_06.component";

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [Qr, Default, E_01, E_02, E_03, E_04, E_05, E_06],
  template: `
    <Default [input]="input || ''" [errorCorrection]="errorCorrection" />

    <div class="qrContainer">
      <div class="qr">
        <E_01
          [input]="input || ''"
          [finderColor]="finderColor"
          [errorCorrection]="errorCorrection"
        />
        <p>E 01</p>
      </div>

      <div class="qr">
        <E_02
          [input]="input || ''"
          [finderColor]="finderColor"
          [errorCorrection]="errorCorrection"
        />
        <p>E 02</p>
      </div>

      <div class="qr">
        <E_03
          [input]="input || ''"
          [finderColor]="finderColor"
          [errorCorrection]="errorCorrection"
        />
        <p>E 03</p>
      </div>

      <div class="qr">
        <E_04
          [input]="input || ''"
          [finderColor]="finderColor"
          [errorCorrection]="errorCorrection"
        />
        <p>E 04</p>
      </div>

      <div class="qr">
        <E_05
          [input]="input || ''"
          [finderColor]="finderColor"
          [errorCorrection]="errorCorrection"
        />
        <p>E 05</p>
      </div>

      <div class="qr">
        <E_06
          [input]="input || ''"
          [finderColor]="finderColor"
          [errorCorrection]="errorCorrection"
        />
        <p>E 06</p>
      </div>
    </div>
  `,
  styleUrl: '../app.component.css',
})
export class CanvasComponent {
  @Input({ required: true }) input: string = '';
  @Input({ required: true }) finderColor: string = '';
  @Input() errorCorrection!: ErrorCorrectionLevelType;
}
