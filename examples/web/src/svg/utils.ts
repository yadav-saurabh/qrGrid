// type for common SVG attributes
type CommonSVGAttributes = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
  width?: number | string;
  height?: number | string;
  x?: number | string;
  y?: number | string;
  viewBox?: string;
  // Add more SVG attributes as needed
  [key: string]: string | number | boolean | undefined;
};

// type for common SVG attributes
type CommonSVGNodes = "path" | "react" | "circle" | string;
// Add more SVG attributes as needed

export function generateSvg(description: string) {
  const p = document.createElement("p");
  p.innerText = description;

  const div = document.createElement("div");
  div.className = "qr";
  document.getElementById("qrContainerSvg")?.appendChild(div);

  const svg: SVGSVGElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  div.appendChild(svg);
  div.appendChild(p);

  return svg;
}

export function setSvgAttributes(
  element: SVGElement,
  attributes: CommonSVGAttributes
) {
  for (const [key, value] of Object.entries(attributes)) {
    if (value !== undefined) {
      element.setAttributeNS(null, key, value.toString());
    }
  }
}

export function createSvgNode(
  element: SVGElement,
  node: CommonSVGNodes,
  attributes?: CommonSVGAttributes
) {
  const n = document.createElementNS("http://www.w3.org/2000/svg", node);
  element.append(n);
  if (attributes) {
    setSvgAttributes(n, attributes);
  }
  return n;
}
