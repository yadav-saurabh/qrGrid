import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CanvasComponent } from './canvas/canvas.component';
import { SvgComponent } from './svg/svg.component';
import { ErrorCorrectionLevelType } from '@qrgrid/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, CanvasComponent, SvgComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  inputText = new FormControl('');
  errorCorrection = new FormControl<ErrorCorrectionLevelType>('M', {
    nonNullable: true,
  });
}
