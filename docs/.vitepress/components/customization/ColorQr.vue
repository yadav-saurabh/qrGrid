<script setup>
import { onMounted, ref, watch } from "vue";

import ColorPicker from "../ColorPicker.vue";
import QrSvg from "../../../assets/qr.svg";

const svgRef = ref(null);

const finderColor = ref("#ff3131");
const codewordColor = ref("currentColor");
const backgroundColor = ref("transparent");

onMounted(() => {
  const elem = document.getElementById("customization-color-qr-svg");
  svgRef.value = elem;
  updateQrColor();
});

function updateQrColor() {
  const finderGroup = svgRef.value.getElementsByClassName("finder");
  const separator = svgRef.value.getElementsByClassName("separator");
  const quiteZone = svgRef.value.getElementsByClassName("quite-zone");
  const codewordLight = svgRef.value.getElementsByClassName(
    "codeword-light-module"
  );
  const codewordDark = svgRef.value.getElementsByClassName(
    "codeword-dark-module"
  );
  if (!finderGroup || !separator || !quiteZone) {
    return;
  }
  const [finderDarkPath, finderLightPath] = finderGroup[0].children;
  // finder dark modules color
  finderDarkPath.style.fill = finderColor.value;
  // dark modules color
  codewordDark[0].style.fill = codewordColor.value;
  // backgroundColor color
  quiteZone[0].style.fill = backgroundColor.value;
  codewordLight[0].style.fill = backgroundColor.value;
  separator[0].style.fill = backgroundColor.value;
  finderLightPath.style.fill = backgroundColor.value;
}

watch([finderColor, codewordColor, backgroundColor], updateQrColor);
</script>

<template>
  <div class="color-picker-container">
    <ColorPicker v-model="finderColor" id="finder-color" />
    <ColorPicker v-model="codewordColor" id="codeword-color" />
    <ColorPicker v-model="backgroundColor" id="background-color" />
  </div>
  <div class="container">
    <QrSvg id="customization-color-qr-svg" class="color-qr"
      ><text>Hello world</text></QrSvg
    >
  </div>
</template>

<style scoped>
.container,
.color-picker-container {
  display: flex;
  justify-content: center;
}
.color-picker-container {
  margin: 10px 0;
}
.color-picker-container :deep(.color-picker) {
  background: transparent;
}
.color-qr {
  height: 320px;
  width: 320px;
}
.color-qr :deep(.finder),
.color-qr :deep(.finder path),
.color-qr :deep(.quite-zone),
.color-qr :deep(.codeword-light-module),
.color-qr :deep(.codeword-dark-module),
.color-qr :deep(.separator) {
  fill-opacity: 1;
}
.color-qr :deep(.data-bit-zero),
.color-qr :deep(.data-bit-one) {
  display: none;
}
</style>
