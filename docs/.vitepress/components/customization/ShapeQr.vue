<script setup lang="ts">
import { ModuleStyleFunctionParams, Qr } from "@qrgrid/vue/svg";
import { getCirclePath } from "@qrgrid/styles/svg";
import { QR, ReservedBits } from "@qrgrid/core";
import { ref } from "vue";

import QrSvg from "../../../assets/qr.svg";

const shapeType = ref<"circle" | "diamond" | "hexagon">("circle");

function qrModuleStyle(
  path: ModuleStyleFunctionParams[0],
  module: ModuleStyleFunctionParams[1],
  qr: QR
) {
  const { x, y, size } = module;
  const { reservedBits } = qr;

  let shapePath = "";
  if (shapeType.value === "circle") {
    shapePath = getCirclePath(x, y, size);
  }
  if (shapeType.value === "diamond") {
    const mid = Math.floor(size / 2);
    shapePath = `M${x + mid} ${y}l-${mid} ${mid}l${mid} ${mid}l${mid} -${mid}z`;
  }
  if (shapeType.value === "hexagon") {
    const d = Math.floor(size / 3);
    const md = Math.floor(size / 2);
    shapePath = `M${x + d} ${y}l-${d} ${md}l${d} ${md}h${d}l${d} -${md}l-${d} -${md}z`;
  }
  if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
    path.finder += shapePath;
    return;
  }
  path.codeword += shapePath;
}
</script>

<template>
  <div class="container">
    <button class="btn" @click="shapeType = 'circle'">Circle</button>
    <button class="btn" @click="shapeType = 'diamond'">Diamond</button>
    <button class="btn" @click="shapeType = 'hexagon'">Hexagon</button>
  </div>
  <div class="container">
    <div class="qr-container">
      <Qr
        class="shape-qr"
        input="https://qrgrid.dev"
        bgColor="transparent"
        :color="{ finder: '#ff3131', codeword: 'currentColor' }"
        :moduleStyle="qrModuleStyle"
        :data-shape-type="shapeType"
      />
      <QrSvg class="shape-qr-stroke" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}
.qr-container {
  position: relative;
}
.btn {
  padding: 5px 20px;
  margin: 5px 10px;
  border: 1px solid var(--vp-c-default-soft);
  border-radius: 5px;
}
.btn:hover {
  border-color: var(--vp-c-brand);
}
.shape-qr,
.shape-qr-stroke {
  height: 320px;
  width: 320px;
}
.shape-qr-stroke {
  position: absolute;
  top: 0;
  left: 0;
}
.shape-qr-stroke :deep(.finder),
.shape-qr-stroke :deep(.finder path),
.shape-qr-stroke :deep(.quite-zone),
.shape-qr-stroke :deep(.codeword-light-module),
.shape-qr-stroke :deep(.codeword-dark-module),
.shape-qr-stroke :deep(.separator) {
  fill-opacity: 0;
}
.shape-qr-stroke :deep(.data-bit-zero),
.shape-qr-stroke :deep(.data-bit-one) {
  display: none;
}
</style>
