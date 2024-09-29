<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

import E_01 from "./E_01.vue";
import E_02 from "./E_02.vue";
import E_03 from "./E_03.vue";
import E_04 from "./E_04.vue";
import E_05 from "./E_05.vue";
import E_06 from "./E_06.vue";

const INPUT = "https://qrgrid.dev";
const FINDER_COLOR = "#ff3131";
const size = ref(400);

function getSize() {
  const width = window.innerWidth;
  if (width < 400) {
    return 250;
  }
  if (width < 850) {
    return 300;
  }
  if (width < 1000) {
    return 350;
  }
  return 400;
}

const onWindowResize = () => {
  size.value = getSize();
};

onMounted(() => {
  size.value = getSize();
  window.addEventListener("resize", onWindowResize);
});
onUnmounted(() => {
  window.removeEventListener("resize", onWindowResize);
});
</script>

<template>
  <div class="container">
    <div class="card">
      <div class="qr">
        <E_01 :input="INPUT" :size="size" :finder-color="FINDER_COLOR" />
      </div>
      <div class="description">
        <p class="heading">01</p>
        <div>
          Canvas:
          <p>Angular:</p>
          <p>React:</p>
        </div>
        <div>Svg:</div>
      </div>
    </div>
    <div class="card">
      <div class="qr">
        <E_02 :input="INPUT" :size="size" :finder-color="FINDER_COLOR" />
      </div>
      <div class="description">
        <p class="heading">02</p>
      </div>
    </div>
    <div class="card">
      <div class="qr">
        <E_03 :input="INPUT" :size="size" :finder-color="FINDER_COLOR" />
      </div>
      <div class="description">
        <p class="heading">03</p>
      </div>
    </div>
    <div class="card">
      <div class="qr">
        <E_04 :input="INPUT" :size="size" :finder-color="FINDER_COLOR" />
      </div>
      <div class="description">
        <p class="heading">04</p>
      </div>
    </div>
    <div class="card">
      <div class="qr">
        <E_05 :input="INPUT" :size="size" :finder-color="FINDER_COLOR" />
      </div>
      <div class="description">
        <p class="heading">05</p>
      </div>
    </div>
    <div class="card">
      <div class="qr">
        <E_06 :input="INPUT" :size="size" :finder-color="FINDER_COLOR" />
      </div>
      <div class="description">
        <p class="heading">06</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 32px;
  margin: 0 auto;
  max-width: 1280px;
}
.card {
  display: grid;
  grid-template-columns: auto;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  padding: 10px;
  text-decoration: none;
  margin-bottom: 20px;
}
@media (min-width: 640px) {
  .card {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
}
.qr {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
}
.description {
  padding: 20px;
}
.heading {
  font-weight: bold;
  font-size: 20px;
  color: var(--vp-c-brand-1);
  border-bottom: 1px solid var(--vp-c-text-1);
}
</style>
