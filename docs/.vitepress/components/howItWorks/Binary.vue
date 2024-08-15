<script setup>
import BinarySvg from "../../../assets/binary.svg";
</script>

<template>
  <div class="container">
    <BinarySvg class="binary" />
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
.binary {
  width: 320px;
}
.binary :deep(.border) {
  display: none;
}
</style>
