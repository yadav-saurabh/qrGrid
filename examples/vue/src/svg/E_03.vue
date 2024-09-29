<script setup lang="ts">
import { QR, ReservedBits } from "@qrgrid/core";
import { ModuleStyleFunctionParams, Qr } from "@qrgrid/vue/svg";
import { getCirclePath } from "@qrgrid/styles/svg";

const props = defineProps<{
  input: string;
  finderColor: string;
}>();

function qrModuleStyle(
  path: ModuleStyleFunctionParams[0],
  module: ModuleStyleFunctionParams[1],
  qr: QR
) {
  const { x, y, size } = module;
  if (qr.reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
    path.finder += getCirclePath(x, y, size);
  } else {
    path.codeword += getCirclePath(x, y, size);
  }
}
</script>

<template>
  <Qr
    :input="props.input"
    :color="{ finder: finderColor }"
    :moduleStyle="qrModuleStyle"
  />
</template>
