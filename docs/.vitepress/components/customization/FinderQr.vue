<script setup>
import QrSvg from "../../../assets/qr.svg";
</script>

<template>
  <div class="container">
    <QrSvg class="finder-qr" />
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
.finder-qr {
  height: 320px;
  width: 320px;
}
.finder-qr :deep(path) {
  fill-opacity: 0.1;
  stroke-opacity: 0.5;
}
.finder-qr :deep(.finder path) {
  fill-opacity: 1;
}
.finder-qr :deep(.data-bit-zero),
.finder-qr :deep(.data-bit-one) {
  display: none;
}
</style>
