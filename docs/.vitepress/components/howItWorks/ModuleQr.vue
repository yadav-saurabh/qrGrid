<script setup>
import QrSvg from "../../../assets/qr.svg";
</script>

<template>
  <div class="container">
    <QrSvg class="module-qr" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}
.module-qr {
  height: 320px;
  width: 320px;
}
</style>
