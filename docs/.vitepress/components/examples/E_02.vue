<script setup lang="ts">
import { QR, ReservedBits } from "@qrgrid/core";
import { Qr } from "@qrgrid/vue/canvas";
import { drawSmoothEdges } from "@qrgrid/styles/canvas";

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
  }
  drawSmoothEdges(ctx, module, qr);
}
</script>

<template>
  <Qr :input="props.input" :size="props.size" :moduleStyle="qrModuleStyle" />
</template>
