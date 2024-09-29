<script setup lang="ts">
import { QR, ReservedBits } from "@qrgrid/core";
import { Qr } from "@qrgrid/vue/canvas";
import {
  drawCircle,
  drawCircleOutline,
  ModuleType,
} from "@qrgrid/styles/canvas";
import { getFinderPatternDetails } from "@qrgrid/styles/common";

const props = defineProps<{
  input: string;
  finderColor: string;
  size: number;
}>();

function qrModuleStyle(
  ctx: CanvasRenderingContext2D,
  module: { index: number; x: number; y: number; size: number },
  qr: QR
) {
  if (qr.reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
    ctx.fillStyle = props.finderColor;
  } else {
    ctx.fillStyle = "white";
    drawCircle(ctx, module);
  }
}

function onGenerated(ctx: CanvasRenderingContext2D, size: number, qr: QR) {
  ctx.fillStyle = props.finderColor;
  const { positions, sizes } = getFinderPatternDetails(size, qr);
  for (let i = 0; i < positions.inner.length; i++) {
    const pos = positions.inner[i];
    drawCircle(ctx, { ...pos, size: sizes.inner } as ModuleType);
  }
  for (let i = 0; i < positions.outer.length; i++) {
    const pos = positions.outer[i];
    drawCircleOutline(ctx, { ...pos, size: sizes.outer } as ModuleType);
  }
}
</script>

<template>
  <Qr
    :input="props.input"
    :size="props.size"
    :moduleStyle="qrModuleStyle"
    :onGenerated="onGenerated"
  />
</template>
