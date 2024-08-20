import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { QR, QrOptions, ReservedBits } from "@qrgrid/core";

/**
 * Function type (ModuleStyleFunction is to style the module)
 */
export type ModuleStyleFunction = (
  path: { codeword: string; finder: string },
  module: { index: number; x: number; y: number; size: number },
  qr: QR
) => void;

export type ModuleStyleFunctionParams = Parameters<ModuleStyleFunction>;

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
 * Qr component color Prop Type
 */
export type QrColor = string | { codeword?: string; finder?: string };

/**
 * default values
 */
const DEFAULT_SVG_SIZE = 400;
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
  path: ModuleStyleFunctionParams[0],
  module: ModuleStyleFunctionParams[1],
  qr: ModuleStyleFunctionParams[2]
) {
  const { x, y, size, index } = module;
  if (qr.reservedBits[index]?.type === ReservedBits.FinderPattern) {
    path.finder += `M${x} ${y}v${size}h${size}v-${size}z`;
  } else {
    path.codeword += `M${x} ${y}v${size}h${size}v-${size}z`;
  }
}

function getColor(colorProp: QrColor, type: "finder" | "codeword") {
  let color = DEFAULT_COLOR;
  if (colorProp && typeof colorProp === "string") {
    color = colorProp;
  }
  if (colorProp && typeof colorProp === "object") {
    if (type === "codeword" && colorProp.codeword) {
      color = colorProp.codeword;
    }
    if (type === "finder" && colorProp.finder) {
      color = colorProp.finder;
    }
  }
  return color;
}

@Component({
  selector: "qr",
  standalone: true,
  imports: [],
  template: `<svg
    #svg
    xmlns="http://www.w3.org/2000/svg"
    [attr.height]="svgSize"
    [attr.width]="svgSize"
    [attr.view-box]="viewBox"
    [attr.style]="svgStyle"
  >
    <path [attr.d]="finderPath" [attr.fill]="finderColor" />
    <path [attr.d]="codewordPath" [attr.fill]="codewordColor" />
    @if (imgData.img) {
      <image
        [attr.x]="imgData.x"
        [attr.y]="imgData.y"
        [attr.height]="imgData.height"
        [attr.width]="imgData.width"
        [attr.opacity]="imgData.a"
        [attr.href]="imgData.img"
      />
    }
  </svg>`,
})
export class Qr {
  @ViewChild("svg", { static: true }) svg!: ElementRef<SVGSVGElement>;

  @Input({ required: true }) input: string = "";
  @Input() qrOptions?: QrOptions;
  @Input() image?: QrImageOption;
  @Input() size?: number;
  @Input() bgColor?: string;
  @Input() color?: QrColor;
  @Input() moduleStyle?: ModuleStyleFunction;

  @Output() onQrDataEncoded = new EventEmitter<QR>();
  @Output() onQrRendered = new EventEmitter<{ size: number; qr: QR }>();

  finderPath: string = "";
  codewordPath: string = "";
  svgSize: number = 0;
  viewBox: string = `0 0 0 0`;
  finderColor: string = DEFAULT_COLOR;
  codewordColor: string = DEFAULT_COLOR;
  svgStyle = `background: ${DEFAULT_BG_COLOR}`;
  imgData = { img: "", a: 0, x: 0, y: 0, height: 0, width: 0 };

  private generateQr() {
    if (!this.input) {
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
    const initialSvgSize = this.size || DEFAULT_SVG_SIZE;
    let size = Math.floor(initialSvgSize / (qr.gridSize + 1.5));
    const border = Math.ceil(size * qr.gridSize - initialSvgSize) + size * 2;
    this.svgSize = initialSvgSize + border;
    this.viewBox = `0 0 ${this.svgSize} ${this.svgSize}`;
    // color
    if (this.color) {
      this.finderColor = getColor(this.color || DEFAULT_COLOR, "finder");
      this.codewordColor = getColor(this.color || DEFAULT_COLOR, "codeword");
    }
    if (this.bgColor) {
      this.svgStyle = `background: ${this.bgColor}`;
    }
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
  }

  private drawImageInCenter(
    qr: QR,
    size: number,
    moduleStyleFunction: ModuleStyleFunction
  ) {
    const img = new Image();
    img.src = this.image!.src;
    if (!this.image?.src) {
      this.imgData = { img: "", a: 0, x: 0, y: 0, height: 0, width: 0 };
    }
    // set overlap and border to bool if undefined
    this.image!.overlap =
      this.image!.overlap === undefined
        ? DEFAULT_IMG_OVERLAP
        : this.image!.overlap;
    this.image!.border =
      this.image!.border === undefined
        ? DEFAULT_IMG_BORDER
        : this.image!.border;
    // on image load
    img.onload = () => {
      // Calculate the desired height and width while maintaining the aspect ratio
      const maxImgSizePercent = this.image?.sizePercent || DEFAULT_IMG_SIZE;
      const maxDimension = this.svgSize * (maxImgSizePercent * 0.01);
      let { height, width } = img;
      // Calculate aspect ratio
      const imgAspectRatio = img.width / img.height;
      if (width > height) {
        width = maxDimension;
        height = maxDimension / imgAspectRatio;
      } else {
        height = maxDimension;
        width = maxDimension * imgAspectRatio;
      }
      const x = (this.svgSize - width) / 2;
      const y = (this.svgSize - height) / 2;

      // draw qr module first
      const imgArea = { x, y, dx: x + width, dy: y + height };
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.globalAlpha = this.image!.opacity || DEFAULT_IMG_OPACITY;
      ctx.drawImage(img, 0, 0, height, width);
      const a = this.image?.opacity || DEFAULT_IMG_OPACITY;
      this.imgData = { img: canvas.toDataURL(), height, width, x, y, a };
      // qr modules
      this.drawQrModules(qr, size, moduleStyleFunction, imgArea);
    };
    // on image load fail
    img.onerror = () => {
      console.error("qrgrid: Error while loading the image");
      // qr modules
      this.drawQrModules(qr, size, moduleStyleFunction);
    };
  }

  // placing each modules in x,y position in the canvas using fillRect
  private drawQrModules(
    qr: QR,
    size: number,
    moduleStyleFunction: ModuleStyleFunction,
    imgArea?: { x: number; y: number; dx: number; dy: number }
  ) {
    let path = { finder: "", codeword: "" };
    let x = size;
    let y = size;
    for (let i = 0; i < qr.data.length; i++) {
      const bit = qr.data[i];
      if (bit && !this.overlappingImage({ x, y, size }, imgArea)) {
        moduleStyleFunction(path, { index: i, x, y, size }, qr);
      }
      x += size;
      if (i % qr.gridSize === qr.gridSize - 1) {
        x = size;
        y += size;
      }
    }
    this.finderPath = path.finder;
    this.codewordPath = path.codeword;
    // event once everything is drawn
    // Use setTimeout to delay the emission to the next change detection cycle
    setTimeout(() => {
      this.onQrRendered.emit({ size, qr });
    });
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

  ngOnChanges() {
    this.generateQr();
  }
}
