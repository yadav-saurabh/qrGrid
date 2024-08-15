/**
 * Qr component to generate QR Code as a svg
 * @module
 */
import { useEffect, forwardRef, Ref, useState } from "react";
import { QR, ReservedBits } from "@qrgrid/core";
import { ModuleStyleFunctionParams, QrProps } from "./types";

const DEFAULT_SVG_SIZE = 400;
const DEFAULT_BG_COLOR = "black";
const DEFAULT_COLOR = "white";
const DEFAULT_IMG_SIZE = 20;
const DEFAULT_IMG_OPACITY = 1;

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
  const { input, qrOptions, image, moduleStyle } = props;

  const [finderPatternPath, setFinderPatternPath] = useState("");
  const [codewordPath, setCodewordPath] = useState("");
  const [svgSize, setSvgSize] = useState(props.size || DEFAULT_SVG_SIZE);
  const [imgData, setImgData] = useState({
    img: "",
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  });

  useEffect(() => {
    // if no input clear the svg
    if (!input) {
      setFinderPatternPath("");
      setCodewordPath("");
      return;
    }
    // generate the qr data
    const qr = new QR(input, qrOptions);
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
    if (moduleStyle && typeof moduleStyle === "function") {
      moduleStyleFunction = moduleStyle;
    }
    // placing each modules in x,y position in the svg using fillRect
    let path = { finder: "", codeword: "" };
    let x = size;
    let y = size;
    for (let i = 0; i < qr.data.length; i++) {
      const bit = qr.data[i];
      if (bit) {
        moduleStyleFunction(path, { x, y, size, index: i }, qr);
      }
      x += size;
      if (i % qr.gridSize === qr.gridSize - 1) {
        x = size;
        y += size;
      }
    }
    setFinderPatternPath(path.finder);
    setCodewordPath(path.codeword);
    // if image place the image in center, QR ErrorCorrectionLevel Should be high and Image should not be more that 25-30% of the svg size to scan the QR code properly
    if (image) {
      const img = new Image();
      img.src = image.src;
      img.onload = () => {
        const height = svgSize * (image.sizePercent || DEFAULT_IMG_SIZE) * 0.01;
        const width = svgSize * (image.sizePercent || DEFAULT_IMG_SIZE) * 0.01;
        const x = (svgSize - width) / 2;
        const y = (svgSize - height) / 2;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d")!;
        ctx.globalAlpha = image.opacity || DEFAULT_IMG_OPACITY;
        ctx.drawImage(img, 0, 0, height, width);

        setImgData({ img: canvas.toDataURL(), height, width, x, y });
      };
    }
    // event once everything is generated but not updated the path value to render
    if (props.onGenerated) {
      props.onGenerated(path, size, qr);
    }
  }, [
    input,
    qrOptions?.errorCorrection,
    image?.src,
    image?.opacity,
    image?.sizePercent,
    props.size,
    moduleStyle,
  ]);

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
      {image ? (
        <image
          id="image"
          x={imgData.x}
          y={imgData.y}
          height={imgData.height}
          width={imgData.width}
          opacity={image.opacity || DEFAULT_IMG_OPACITY}
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
