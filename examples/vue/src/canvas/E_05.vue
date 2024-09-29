<script setup lang="ts">
import { QR, ReservedBits } from "@qrgrid/core";
import { Qr } from "@qrgrid/vue/canvas";

const props = defineProps<{
  input: string;
  finderColor: string;
}>();

function qrModuleStyle(
  ctx: CanvasRenderingContext2D,
  module: { index: number; x: number; y: number; size: number },
  { reservedBits }: QR
) {
  if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
    ctx.fillStyle = props.finderColor;
  }
  ctx.fillRect(module.x, module.y, module.size * 0.95, module.size * 0.95);
  ctx.fillStyle = "white";
}
</script>

<template>
  <Qr
    :input="props.input"
    :moduleStyle="qrModuleStyle"
    :image="{ src: './vite.svg' }"
  />
</template>
