<script setup lang="ts">
import { QR, ReservedBits } from "@qrgrid/core";
import { ModuleStyleFunctionParams, Qr } from "@qrgrid/vue/svg";
import {
  getNeighbor,
  getRoundCornerPath,
  getSquarePath,
  getCirclePath,
} from "@qrgrid/styles/svg";
import { ref, watch } from "vue";

const styles = ref("s1");
const input = ref("https://qrgrid.dev");

const onGenerated = (
  path: ModuleStyleFunctionParams[0],
  size: number,
  qr: QR
) => {
  console.log("on generated");
  path.codeword += getCirclePath(0, 0, size * 7);
};

const qrModuleStyle = (
  path: ModuleStyleFunctionParams[0],
  module: ModuleStyleFunctionParams[1],
  qr: QR,
  _style: string
) => {
  const { reservedBits } = qr;
  const { x, y, size } = module;
  if (styles.value === "default") {
    const defaultPath = getSquarePath(x, y, size);
    path.codeword += defaultPath;
    path.finder += defaultPath;
    return;
  }

  const neighbor = getNeighbor(module.index, qr);

  if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
    return;
    // if (!neighbor.top && !neighbor.right) {
    //   path.finder += getRoundCornerPath(module, ["top-right"], size);
    //   return;
    // }
    // if (!neighbor.bottom && !neighbor.left) {
    //   path.finder += getRoundCornerPath(module, ["bottom-left"], size);
    //   return;
    // }
    // path.finder += getSquarePath(x, y, size);
    // return;
  }
  path.codeword += getCirclePath(x, y, size);
};

watch(styles, () => {
  console.log(styles.value);
  // qrModuleStyle()
  input.value = `https://qrgrid.dev#${styles.value}`;
});
</script>

<template>
  <Qr
    :input="input"
    bgColor="transparent"
    :color="{ finder: '#C73659', codeword: 'currentColor' }"
    :moduleStyle="qrModuleStyle"
  />
  <button
    class="action VPButton medium"
    role="button"
    @click="styles = 'default'"
    :onGenerated="onGenerated"
  >
    default
  </button>
</template>

<style scoped>
.action {
  display: inline-block;
  border: 1px solid transparent;
  border-top-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-left-color: transparent;
  text-align: center;
  font-weight: 600;
  white-space: nowrap;
  transition:
    color 0.25s,
    border-color 0.25s,
    background-color 0.25s;
  border-radius: 5px;
  padding: 0 20px;
  line-height: 38px;
  font-size: 14px;
  border-color: var(--vp-button-alt-border);
  color: var(--vp-button-alt-text);
  background-color: var(--vp-button-alt-bg);
}
.action:hover {
  border-color: var(--vp-button-alt-hover-border);
  color: var(--vp-button-alt-hover-text);
  background-color: var(--vp-button-alt-hover-bg);
}
</style>
