<script setup lang="ts">
import { QR } from "@qrgrid/core";
import { ModuleStyleFunctionParams, Qr } from "@qrgrid/vue/svg";
import { onMounted, onUnmounted, ref } from "vue";
import { getOnGeneratedQrPaths, getQrPaths } from "./qr-styles";

const style = ref(0);
const svgSize = ref(getCanvasSize());
const input = ref("https://qrgrid.dev");

function onGenerated(path: ModuleStyleFunctionParams[0], size: number, qr: QR) {
  const { codeword, finder } = getOnGeneratedQrPaths(style.value, size, qr);
  path.finder += finder;
  path.codeword += codeword;
}

function qrModuleStyle(
  path: ModuleStyleFunctionParams[0],
  module: ModuleStyleFunctionParams[1],
  qr: QR
) {
  const { codeword, finder } = getQrPaths(style.value, module, qr);
  path.finder += finder;
  path.codeword += codeword;
}

function getCanvasSize() {
  const width = window.innerWidth;
  if (width < 640) {
    return 220;
  }
  if (width < 960) {
    return 300;
  }
  return 360;
}

let animationFrame: number;
let previousTimeStamp = 0;
const TIME_IN_SEC = 3 * 1000;

const animate = (timeStamp: number) => {
  if (!previousTimeStamp || timeStamp - previousTimeStamp >= TIME_IN_SEC) {
    previousTimeStamp = timeStamp;
    style.value = style.value === 6 ? 1 : style.value + 1;
  }
  animationFrame = requestAnimationFrame(animate);
};

const onWindowResize = () => {
  svgSize.value = getCanvasSize();
};

onMounted(() => {
  animationFrame = requestAnimationFrame(animate);
  window.addEventListener("resize", onWindowResize);
});
onUnmounted(() => {
  cancelAnimationFrame(animationFrame);
  window.removeEventListener("resize", onWindowResize);
});
</script>

<template>
  <div class="qr-container">
    <Transition>
      <Qr
        class="animation-qr"
        :input="input"
        bgColor="transparent"
        :color="{ finder: '#ff3131', codeword: 'currentColor' }"
        :moduleStyle="qrModuleStyle"
        :onGenerated="onGenerated"
        :size="svgSize"
        :key="style"
      />
    </Transition>
  </div>
</template>

<style scoped>
.qr-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.animation-qr {
  position: absolute;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
