<script setup lang="ts">
import { QR, ReservedBits } from "@qrgrid/core";
import { Qr, ModuleStyleFunctionParams } from "@qrgrid/vue/svg";

const props = defineProps<{
  input: string;
  finderColor: string;
}>();

function qrModuleStyle(
  path: ModuleStyleFunctionParams[0],
  module: ModuleStyleFunctionParams[1],
  { reservedBits }: QR
) {
  const { x, y } = module;
  const size = module.size * 0.95;
  const squarePath = `M${x} ${y}v${size}h${size}v-${size}z`;
  if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
    path.finder += squarePath;
  } else {
    path.codeword += squarePath;
  }
}
</script>

<template>
  <Qr
    :input="props.input"
    :color="{ finder: finderColor }"
    :moduleStyle="qrModuleStyle"
    :image="{ src: './vite.svg' }"
  />
</template>
