<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

import Card from "./Card.vue";
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
  if (width < 800) {
    return 320;
  }
  if (width < 1024) {
    return 350;
  }
  if (width > 1390) {
    return width / 4;
  }
  return width / 3.5;
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
    <Card example="E_01">
      <E_01
        class="qr"
        :input="INPUT"
        :size="size"
        :finder-color="FINDER_COLOR"
      />
    </Card>
    <Card example="E_02">
      <E_02
        class="qr"
        :input="INPUT"
        :size="size"
        :finder-color="FINDER_COLOR"
      />
    </Card>
    <Card example="E_03">
      <E_03
        class="qr"
        :input="INPUT"
        :size="size"
        :finder-color="FINDER_COLOR"
      />
    </Card>
    <Card example="E_04">
      <E_04
        class="qr"
        :input="INPUT"
        :size="size"
        :finder-color="FINDER_COLOR"
      />
    </Card>
    <Card example="E_05">
      <E_05
        class="qr"
        :input="INPUT"
        :size="size"
        :finder-color="FINDER_COLOR"
      />
    </Card>
    <Card example="E_06">
      <E_06
        class="qr"
        :input="INPUT"
        :size="size"
        :finder-color="FINDER_COLOR"
      />
    </Card>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  padding: 32px;
  margin: 0 auto;
  max-width: 1280px;
}
.qr {
  display: block;
  margin: auto;
  margin-top: 10px;
}
</style>
