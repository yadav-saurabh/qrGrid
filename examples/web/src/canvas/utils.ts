export function generateCanvas(description: string) {
  const p = document.createElement("p");
  p.innerText = description;

  const div = document.createElement("div");
  div.className = "qr";
  document.getElementById("qrContainerCanvas")?.appendChild(div);

  const canvas = document.createElement("canvas");
  div.appendChild(canvas);
  div.appendChild(p);

  return canvas;
}
