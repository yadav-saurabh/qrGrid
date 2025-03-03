<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  example: string;
}>();

const description = ref(false);

const REPO_EXAMPLE_URL =
  "https://github.com/yadav-saurabh/qrGrid/blob/main/examples";

const FRONTEND_TYPE = [
  { name: "web", file: ".ts" },
  { name: "vue", file: ".vue" },
  { name: "react", file: ".tsx" },
  { name: "angular", prefix: "app", file: ".component.ts" },
];
</script>

<template>
  <div
    class="card"
    @mouseover="description = true"
    @mouseleave="description = false"
  >
    <slot>Fallback content</slot>
    <p class="heading">{{ props.example.replace("E_", "") }}</p>
    <div class="description-container" v-if="description">
      <div class="description">
        <!-- <div class="d-flex">
          <span class="w-45">Server:</span>
          <a
            target="_blank"
            :href="`${REPO_EXAMPLE_URL}/server/src/${example}.ts`"
          >
            <span class="link"> Express</span>
          </a>
        </div> -->

        <div class="d-flex">
          <span class="w-45">Svg:</span>
          <a
            target="_blank"
            v-for="item in FRONTEND_TYPE"
            :key="item.name"
            :href="`${REPO_EXAMPLE_URL}/${item.name}/src/${item.prefix || ''}/svg/${example}${item.file}`"
          >
            <span class="link"> {{ item.name }} </span>
          </a>
        </div>

        <div class="d-flex">
          <span class="w-45">Canvas:</span>
          <a
            target="_blank"
            v-for="item in FRONTEND_TYPE"
            :key="item.name"
            :href="`${REPO_EXAMPLE_URL}/${item.name}/src/${item.prefix || ''}/canvas/${example}${item.file}`"
          >
            <span class="link"> {{ item.name }} </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  margin: 10px;
  position: relative;
  border: 1px dotted var(--vp-c-text-1);
}
@media (min-width: 640px) {
  .card {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
}
.heading {
  font-weight: bold;
  font-size: 20px;
  color: var(--vp-c-brand-1);
  text-align: center;
  border-top: 1px dotted var(--vp-c-text-1);
}
.description-container {
  position: absolute;
  top: 0;
  left: 0;
  height: calc(100% - 25px);
  width: 100%;
  backdrop-filter: blur(5px);
}
.description {
  padding: 10px;
  background-color: var(--vp-c-bg);
  position: absolute;
  bottom: 0;
  height: 30%;
  overflow: scroll;
  width: 100%;
}
.link {
  margin-left: 20px;
  color: var(--vp-c-important-3);
  text-transform: capitalize;
}
.link:hover {
  color: var(--vp-c-brand);
}
.d-flex {
  display: flex;
}
.w-45 {
  width: 45px;
}
</style>
