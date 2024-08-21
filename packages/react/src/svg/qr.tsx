/**
 * Qr component to generate QR Code as a svg
 * @module
 */
import { useEffect, forwardRef, Ref, useState } from "react";
import { QR, ReservedBits } from "@qrgrid/core";
import {
  ModuleStyleFunction,
  ModuleStyleFunctionParams,
  QrProps,
} from "./types";

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

function getColor(colorProp: QrProps["color"], type: "finder" | "codeword") {
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

/**
 * Qr component generate QR code as a svg
 */
function QrComponent(props: QrProps, ref: Ref<SVGSVGElement>) {
  const [finderPatternPath, setFinderPatternPath] = useState("");
  const [codewordPath, setCodewordPath] = useState("");
  const [svgSize, setSvgSize] = useState(props.size || DEFAULT_SVG_SIZE);
  const [imgData, setImgData] = useState({
    img: "",
    a: 0,
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  });

  useEffect(() => {
    if (!props.input) {
      setFinderPatternPath("");
      setCodewordPath("");
      return;
    }
    generateQr();
  }, [
    props.input,
    props.qrOptions?.errorCorrection,
    props.size,
    props.image?.src,
    props.image?.opacity,
    props.image?.sizePercent,
    props.image?.overlap,
    props.image?.border,
  ]);

  /**
   * generateQr draws the QR code as a svg
   */
  function generateQr() {
    // generate the qr data
    const qr = new QR(props.input, props.qrOptions);
    // pass the qr data to the parent
    if (props.getQrData) {
      props.getQrData(qr);
    }
    // calculate module size and adjusting svg to height and wight
    const initialSvgSize = props.size || DEFAULT_SVG_SIZE;
    let size = Math.floor(initialSvgSize / (qr.gridSize + 1.5));
    const border = Math.ceil(size * qr.gridSize - initialSvgSize) + size * 2;
    setSvgSize(initialSvgSize + border);
    // use default function to draw module or use the props function
    let moduleStyleFunction = applyModuleStyle;
    if (props.moduleStyle && typeof props.moduleStyle === "function") {
      moduleStyleFunction = props.moduleStyle;
    }
    // if image place the image in center, QR ErrorCorrectionLevel Should be high and Image should not be more that 25-30% of the qr size to scan the QR code properly
    if (props.image) {
      drawImageInCenter(qr, size, moduleStyleFunction);
      return;
    }
    // placing each modules in x,y position in the qr using fillRect
    drawQrModules(qr, size, moduleStyleFunction);
  }

  /**
   * if image place it in center of the qr
   */
  function drawImageInCenter(
    qr: QR,
    size: number,
    moduleStyleFunction: ModuleStyleFunction
  ) {
    const img = new Image();
    img.src = props.image!.src;
    if (!props.image?.src) {
      setImgData({ img: "", a: 0, x: 0, y: 0, height: 0, width: 0 });
    }
    // set overlap and border to bool if undefined
    props.image!.overlap =
      props.image!.overlap === undefined
        ? DEFAULT_IMG_OVERLAP
        : props.image!.overlap;
    props.image!.border =
      props.image!.border === undefined
        ? DEFAULT_IMG_BORDER
        : props.image!.border;
    // on image load
    img.onload = () => {
      // Calculate the desired height and width while maintaining the aspect ratio
      const maxImgSizePercent = props.image?.sizePercent || DEFAULT_IMG_SIZE;
      const maxDimension = svgSize * (maxImgSizePercent * 0.01);
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
      const x = (svgSize - width) / 2;
      const y = (svgSize - height) / 2;

      // draw qr module first
      const imgArea = { x, y, dx: x + width, dy: y + height };
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.globalAlpha = props.image!.opacity || DEFAULT_IMG_OPACITY;
      ctx.drawImage(img, 0, 0, height, width);
      const a = props.image?.opacity || DEFAULT_IMG_OPACITY;
      setImgData({ img: canvas.toDataURL(), height, width, x, y, a });
      // qr modules
      drawQrModules(qr, size, moduleStyleFunction, imgArea);
    };
    // on image load fail
    img.onerror = () => {
      console.error("qrgrid: Error while loading the image");
      // qr modules
      drawQrModules(qr, size, moduleStyleFunction);
    };
  }

  /**
   * placing each modules in x,y position
   */
  function drawQrModules(
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
      if (bit && !overlappingImage({ x, y, size }, imgArea)) {
        moduleStyleFunction(path, { index: i, x, y, size }, qr);
      }
      x += size;
      if (i % qr.gridSize === qr.gridSize - 1) {
        x = size;
        y += size;
      }
    }
    // event once everything is done before updating the path
    if (props.onGenerated) {
      props.onGenerated(path, size, qr);
    }
    setFinderPatternPath(path.finder);
    setCodewordPath(path.codeword);
  }

  /**
   * check if the image overlaps with the path bit
   */
  function overlappingImage(
    module: { x: number; y: number; size: number },
    imgArea?: { x: number; y: number; dx: number; dy: number }
  ): boolean {
    if (!imgArea || props.image?.overlap === true) {
      return false;
    }

    const moduleXEnd = module.x + module.size;
    const moduleYEnd = module.y + module.size;
    const border = props.image?.border ? module.size : 0;

    return (
      module.x < imgArea.dx + border &&
      module.y < imgArea.dy + border &&
      moduleXEnd > imgArea.x - border &&
      moduleYEnd > imgArea.y - border
    );
  }

  return (
    <svg
      height={svgSize}
      width={svgSize}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      style={{ background: props.bgColor || DEFAULT_BG_COLOR }}
      ref={ref}
    >
      <path
        id="finder"
        d={finderPatternPath}
        fill={getColor(props.color, "finder")}
      />
      <path
        id="codeword"
        d={codewordPath}
        fill={getColor(props.color, "codeword")}
      />
      {props.image ? (
        <image
          id="image"
          x={imgData.x}
          y={imgData.y}
          height={imgData.height}
          width={imgData.width}
          opacity={imgData.a}
          href={imgData.img}
        />
      ) : null}
    </svg>
  );
}

/**
 * Qr component forwardRef
 * Qr component create the QR code in a svg format
 */
export const Qr = forwardRef<SVGSVGElement, QrProps>(QrComponent);
