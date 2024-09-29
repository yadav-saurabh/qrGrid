<script setup lang="ts">
import { QR, ReservedBits } from "@qrgrid/core";
import {
  getFinderPatternDetails,
  isOuterFinderPattern,
} from "@qrgrid/styles/common";
import { getCirclePath, getSquarePath } from "@qrgrid/styles/svg";
import { ModuleStyleFunctionParams, Qr } from "@qrgrid/vue/svg";

const props = defineProps<{
  input: string;
  finderColor: string;
}>();

function qrModuleStyle(
  path: ModuleStyleFunctionParams[0],
  module: ModuleStyleFunctionParams[1],
  qr: QR
) {
  const { reservedBits } = qr;
  const { x, y } = module;
  if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
    if (isOuterFinderPattern(module.index, qr)) {
      path.finder += getSquarePath(x, y, module.size);
    }
  } else {
    const size = module.size * 0.95;
    const squarePath = `M${x} ${y}v${size}h${size}v-${size}z`;
    path.codeword += squarePath;
  }
}

function onGenerated(path: ModuleStyleFunctionParams[0], size: number, qr: QR) {
  const { positions, sizes } = getFinderPatternDetails(size, qr);
  for (let i = 0; i < positions.inner.length; i++) {
    const pos = positions.inner[i];
    path.finder += getCirclePath(pos.x, pos.y, sizes.inner);
  }
}
</script>

<template>
  <Qr
    :input="props.input"
    :color="{ finder: finderColor }"
    :moduleStyle="qrModuleStyle"
    :onGenerated="onGenerated"
    :image="{ src: './vite.svg', overlap: false }"
  />
</template>
