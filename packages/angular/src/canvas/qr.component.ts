import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { QR, QrOptions } from "@qrgrid/core";

/**
 * Function type (ModuleStyleFunction is to style the module)
 */
export type ModuleStyleFunction = (
  ctx: CanvasRenderingContext2D,
  module: { index: number; x: number; y: number; size: number },
  qr: QR
) => void;

/**
 * Param Types of function ModuleStyleFunction
 */
export type ModuleStyleFunctionParams = Parameters<ModuleStyleFunction>;

/**
 * Function type (GeneratedFunction is to called when the Qr is generated)
 */
export type GeneratedFunction = (
  ctx: CanvasRenderingContext2D,
  size: number,
  qr: QR
) => void;

/**
 * Qr component bgColor and color Prop Type
 */
export type QrColor = string | CanvasGradient | CanvasPattern;

/**
 * Qr component Image Prop Type
 */
export type QrImageOption = {
  src: string;
  sizePercent?: number;
  opacity?: number;
  overlap?: boolean;
  border?: boolean;
};

/**
 * default values
 */
const DEFAULT_CANVAS_SIZE = 400;
const DEFAULT_BG_COLOR = "black";
const DEFAULT_COLOR = "white";
const DEFAULT_IMG_SIZE = 15;
const DEFAULT_IMG_OPACITY = 1;
const DEFAULT_IMG_BORDER = false;
const DEFAULT_IMG_OVERLAP = true;

/**
 * To apply default module style
 */
function applyModuleStyle(
  ctx: ModuleStyleFunctionParams[0],
  module: ModuleStyleFunctionParams[1],
  _qr: ModuleStyleFunctionParams[2]
) {
  ctx.fillRect(module.x, module.y, module.size, module.size);
}

/**
 * Qr component
 */
@Component({
  selector: "qr",
  standalone: true,
  template: `<canvas #canvas></canvas>`,
})
export class Qr implements OnInit, OnChanges {
  @ViewChild("canvas", { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;

  @Input({ required: true }) input: string = "";
  @Input() qrOptions?: QrOptions;
  @Input() image?: QrImageOption;
  @Input() size?: number;
  @Input() bgColor?: QrColor | ((ctx: CanvasRenderingContext2D) => QrColor);
  @Input() color?: QrColor | ((ctx: CanvasRenderingContext2D) => QrColor);
  @Input() moduleStyle?: ModuleStyleFunction;
  @Input() generated?: GeneratedFunction;

  @Output() onQrDataEncoded = new EventEmitter<QR>();

  private generateQr() {
    if (!this.ctx) {
      return;
    }
    // canvas size will adjusted with respect to module size to get a perfect square
    const canvasSize = this.size || DEFAULT_CANVAS_SIZE;
    // if no input clear the canvas
    if (!this.input) {
      const { height, width } = this.canvas.nativeElement;
      this.ctx.clearRect(0, 0, height, width);
      return;
    }

    // Encode data
    const qr = new QR(this.input, this.qrOptions);
    // Emit the new QR data
    // Use setTimeout to delay the emission to the next change detection cycle
    setTimeout(() => {
      this.onQrDataEncoded.emit(qr);
    });
    // calculate module size and adjusting canvas to height and wight
    let size = Math.floor(canvasSize / (qr.gridSize + 1.5));
    const border = Math.ceil(size * qr.gridSize - canvasSize) + size * 2;
    this.canvas.nativeElement.height = canvasSize + border;
    this.canvas.nativeElement.width = canvasSize + border;
    // module color
    this.ctx.fillStyle =
      typeof this.color === "function"
        ? this.color(this.ctx)
        : this.color || DEFAULT_COLOR;
    // use default function to draw module or use the props function
    let moduleStyleFunction = applyModuleStyle;
    if (this.moduleStyle && typeof this.moduleStyle === "function") {
      moduleStyleFunction = this.moduleStyle;
    }

    // if image place the image in center, QR ErrorCorrectionLevel Should be high and Image should not be more that 25-30% of the Canvas size to scan the QR code properly
    if (this.image) {
      this.drawImageInCenter(qr, size, moduleStyleFunction);
      return;
    }
    // placing each modules in x,y position in the canvas using fillRect
    this.drawQrModules(qr, size, moduleStyleFunction);
    // background color
    this.drawBackgroundColor();
    // event once everything is drawn
    if (this.generated) {
      this.generated(this.ctx, size, qr);
    }
  }

  private drawImageInCenter(
    qr: QR,
    size: number,
    moduleStyleFunction: ModuleStyleFunction
  ) {
    const img = new Image();
    img.src = this.image!.src;
    // set overlap and border to bool if undefined
    this.image!.overlap =
      this.image!.overlap === undefined
        ? DEFAULT_IMG_OVERLAP
        : this.image!.overlap;
    this.image!.border =
      this.image!.border === undefined
        ? DEFAULT_IMG_BORDER
        : this.image!.border;
    img.onload = () => {
      const canvasSize = this.canvas.nativeElement.height;
      // clear previous canvas
      this.ctx.clearRect(0, 0, canvasSize, canvasSize);
      // Calculate the desired height and width while maintaining the aspect ratio
      const maxImgSizePercent = this.image?.sizePercent || DEFAULT_IMG_SIZE;
      const maxDimension = canvasSize * (maxImgSizePercent * 0.01);
      let dHeight = img.width;
      let dWidth = img.height;
      // Calculate aspect ratio
      const imgAspectRatio = img.width / img.height;
      if (dWidth > dHeight) {
        dWidth = maxDimension;
        dHeight = maxDimension / imgAspectRatio;
      } else {
        dHeight = maxDimension;
        dWidth = maxDimension * imgAspectRatio;
      }
      const dxLogo = (canvasSize - dWidth) / 2;
      const dyLogo = (canvasSize - dHeight) / 2;

      // draw qr module first
      const imgArea = {
        x: dxLogo,
        y: dyLogo,
        dx: dxLogo + dWidth,
        dy: dyLogo + dHeight,
      };
      // qr modules
      this.drawQrModules(qr, size, moduleStyleFunction, imgArea);
      // draw image
      this.ctx.save();
      this.ctx.globalAlpha = this.image?.opacity || DEFAULT_IMG_OPACITY;
      this.ctx.drawImage(img, dxLogo, dyLogo, dWidth, dHeight);
      this.ctx.restore();
      // background color
      this.drawBackgroundColor();
      // event once everything is drawn
      if (this.generated) {
        this.generated(this.ctx, size, qr);
      }
    };
    img.onerror = () => {
      console.error("qrgrid: Error while loading the image");
      // qr modules
      this.drawQrModules(qr, size, moduleStyleFunction);
      // background color
      this.drawBackgroundColor();
      // event once everything is drawn
      if (this.generated) {
        this.generated(this.ctx, size, qr);
      }
    };
  }

  // placing each modules in x,y position in the canvas using fillRect
  private drawQrModules(
    qr: QR,
    size: number,
    moduleStyleFunction: ModuleStyleFunction,
    imgArea?: { x: number; y: number; dx: number; dy: number }
  ) {
    let x = size;
    let y = size;
    for (let i = 0; i < qr.data.length; i++) {
      const bit = qr.data[i];
      if (bit && !this.overlappingImage({ x, y, size }, imgArea)) {
        moduleStyleFunction(this.ctx, { index: i, x, y, size }, qr);
      }
      x += size;
      if (i % qr.gridSize === qr.gridSize - 1) {
        x = size;
        y += size;
      }
    }
  }

  private overlappingImage(
    module: { x: number; y: number; size: number },
    imgArea?: { x: number; y: number; dx: number; dy: number }
  ): boolean {
    if (!imgArea || this.image?.overlap === true) {
      return false;
    }

    const moduleXEnd = module.x + module.size;
    const moduleYEnd = module.y + module.size;
    const border = this.image?.border ? module.size : 0;

    return (
      module.x < imgArea.dx + border &&
      module.y < imgArea.dy + border &&
      moduleXEnd > imgArea.x - border &&
      moduleYEnd > imgArea.y - border
    );
  }

  // background color
  private drawBackgroundColor() {
    const size = this.canvas.nativeElement.height;
    this.ctx.save();
    this.ctx.globalCompositeOperation = "destination-over";
    this.ctx.fillStyle =
      typeof this.bgColor === "function"
        ? this.bgColor(this.ctx)
        : this.bgColor || DEFAULT_BG_COLOR;
    this.ctx.fillRect(0, 0, size, size);
    this.ctx.restore();
  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext("2d")!;
    this.generateQr();
  }

  ngOnChanges() {
    this.generateQr();
  }
}
