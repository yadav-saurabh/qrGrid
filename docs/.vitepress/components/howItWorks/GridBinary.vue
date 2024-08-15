<script setup>
import QrSvg from "../../../assets/qr.svg";
</script>

<template>
  <div class="container">
    <QrSvg class="grid-binary" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}
.grid-binary {
  height: 320px;
  width: 320px;
}
.grid-binary :deep(.finder),
.grid-binary :deep(.finder) path,
.grid-binary :deep(.separator),
.grid-binary :deep(.quite-zone),
.grid-binary :deep(.codeword-light-module),
.grid-binary :deep(.codeword-dark-module) {
  fill: none;
  stroke-opacity: 0.4;
}
</style>
