<script setup lang="ts">
import { QR, ReservedBits } from "@qrgrid/core";
import { Qr, ModuleStyleFunctionParams } from "@qrgrid/vue/svg";
import { getCircleOutlinePath, getCirclePath } from "@qrgrid/styles/svg";
import { getFinderPatternDetails } from "@qrgrid/styles/common";

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
  if (!(qr.reservedBits[module.index]?.type === ReservedBits.FinderPattern)) {
    path.codeword += getCirclePath(x, y, size);
  }
}

function onGenerated(path: ModuleStyleFunctionParams[0], size: number, qr: QR) {
  // ctx.fillStyle = props.finderColor;
  const { positions, sizes } = getFinderPatternDetails(size, qr);
  for (let i = 0; i < positions.inner.length; i++) {
    const pos = positions.inner[i];
    path.finder += getCirclePath(pos.x, pos.y, sizes.inner);
  }
  for (let i = 0; i < positions.outer.length; i++) {
    const pos = positions.outer[i];
    path.finder += getCircleOutlinePath(pos.x, pos.y, sizes.outer);
  }
}
</script>

<template>
  <Qr
    :input="props.input"
    :color="{ finder: finderColor }"
    :moduleStyle="qrModuleStyle"
    :onGenerated="onGenerated"
  />
</template>
