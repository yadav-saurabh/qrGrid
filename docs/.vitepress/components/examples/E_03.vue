<script setup lang="ts">
import { QR, ReservedBits } from "@qrgrid/core";
import { Qr } from "@qrgrid/vue/canvas";
import { drawCircle } from "@qrgrid/styles/canvas";

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
  }
  drawCircle(ctx, module);
  ctx.fillStyle = "white";
}
</script>

<template>
  <Qr
    :input="props.input"
    :size="props.size"
    :moduleStyle="qrModuleStyle"
  />
</template>
