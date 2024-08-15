<script setup>
import QrSvg from "../../../assets/qr.svg";

const items = Array(25)
  .fill()
  .map((_, i) => i + 1);
</script>

<template>
  <div class="container">
    <div class="qr-container">
      <div class="module-count">
        <span v-for="i in items">{{ i }}</span>
      </div>
      <div class="module-count vertical">
        <span v-for="i in items">{{ i }}</span>
      </div>
      <QrSvg class="module-qr" />
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
.module-count {
  position: absolute;
  width: 100%;
  top: -8px;
  left: 12px;
}
.module-count span {
  font-size: 7px;
  display: inline-block;
  height: 12px;
  width: 12px;
}
.module-count.vertical {
  top: 5px;
  left: -2px;
  text-align: right;
}
.module-count.vertical span {
  display: block;
}
.module-qr {
  height: 320px;
  width: 320px;
}
.module-qr :deep(path) {
  fill-opacity: 0.1;
}
.module-qr :deep(.data-bit-zero),
.module-qr :deep(.data-bit-one),
.module-qr :deep(.quite-zone) {
  display: none;
}
</style>
