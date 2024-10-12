import { Component, Input, ViewChild } from '@angular/core';
import { ErrorCorrectionLevelType, QR } from '@qrgrid/core';

import { downloadQr } from '../../../../../packages/styles/src/svg'; // @qrgrid/styles/svg
import { Qr } from '@qrgrid/angular/src/svg'; // @qrgrid/angular/svg

@Component({
  selector: 'Default',
  standalone: true,
  imports: [Qr],
  template: `
    <div class="defaultQrContainer">
      <div style="position: relative; left: -4rem;">
        <h2>Default Qr</h2>
        Version: {{ qrData?.version || 0 }}<br />
        Size: {{ qrData?.gridSize || 0 }} <br />
        Error Correction: {{ qrData?.errorCorrection || 'N.A' }}<br />
        Total bits size: {{ (qrData?.data || []).length }}<br />
        Reserved bits length: {{ getReservedBitsLength() }}<br />
        Segments:<br />
        <span class="segments">
          @for (segments of qrData?.segments || []; track segments.mode) {
            <b>{{ segments.mode }}</b> - <span>{{ segments.value }}</span>
            <br />
          }
        </span>
        <div>
          <button type="button" (click)="download()">Download</button>
        </div>
      </div>
      <qr
        [input]="input"
        [qrOptions]="{ errorCorrection: this.errorCorrection }"
        (onQrDataEncoded)="onQrDataEncoded($event)"
      />
    </div>
  `,
  styleUrl: '../app.component.css',
})
export class Default {
  @Input({ required: true }) input: string = '';
  @Input() errorCorrection!: ErrorCorrectionLevelType;
  @ViewChild(Qr) svgQr!: Qr;

  qrData?: QR;

  getReservedBitsLength() {
    Object.keys(this.qrData?.reservedBits || {}).length;
  }

  onQrDataEncoded(qr: QR) {
    this.qrData = qr;
  }

  download() {
    if (this.svgQr?.svg?.nativeElement) {
      downloadQr(this.svgQr.svg.nativeElement);
    }
  }
}
