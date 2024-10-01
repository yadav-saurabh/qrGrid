<script setup lang="ts">
import { QR, ReservedBits } from "@qrgrid/core";
import { ModuleStyleFunctionParams, Qr } from "@qrgrid/vue/svg";
import { getSmoothEdgesPath } from "@qrgrid/styles/svg";

const props = defineProps<{
  input: string;
  finderColor: string;
}>();

function qrModuleStyle(
  path: ModuleStyleFunctionParams[0],
  module: ModuleStyleFunctionParams[1],
  qr: QR
) {
  if (qr.reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
    path.finder += getSmoothEdgesPath(module, qr);
  } else {
    path.codeword += getSmoothEdgesPath(module, qr);
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
