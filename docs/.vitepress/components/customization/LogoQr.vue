<script setup lang="ts">
import QrSvg from "../../../assets/qr.svg";
import SaurabhImg from "../../../assets/yadav-saurabh.png";
</script>

<template>
  <div class="container">
    <div class="qr-container">
      <QrSvg class="logo-qr" />
      <img class="img" :src="SaurabhImg" alt="saurabh image" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}
.qr-container {
  position: relative;
}
.img {
  position: absolute;
  top: 40%;
  left: 40%;
  height: 20%;
  width: 20%;
}
.logo-qr {
  height: 320px;
  width: 320px;
}
.logo-qr :deep(.finder path:first-child) {
  fill-opacity: 1;
  fill: #ff3131;
}
.logo-qr :deep(.codeword-dark-module) {
  fill-opacity: 1;
  fill: currentColor;
}
.logo-qr :deep(.finder path:not(:first-child)),
.logo-qr :deep(.quite-zone),
.logo-qr :deep(.codeword-light-module),
.logo-qr :deep(.separator) {
  fill: transparent;
}
.logo-qr :deep(.data-bit-zero),
.logo-qr :deep(.data-bit-one) {
  display: none;
}
</style>
