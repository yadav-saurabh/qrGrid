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
  { name: "angular", file: ".ts" },
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
    <div class="description" v-if="description">
      <p>
        <a
          target="_blank"
          :href="`${REPO_EXAMPLE_URL}/server/src/${example}.vue`"
        >
          Server: <span class="link">.../{{ example }}.ts </span>
        </a>
      </p>
      <p>Svg:</p>
      <ul>
        <li v-for="item in FRONTEND_TYPE">
          <a
            target="_blank"
            :href="`${REPO_EXAMPLE_URL}/${item.name}/src/svg/${example}${item.file}`"
          >
            <span class="name">{{ item.name }}: </span>
            <span class="link">.../svg/{{ example }}{{ item.file }}</span>
          </a>
        </li>
      </ul>
      <p>Canvas:</p>
      <ul>
        <li v-for="item in FRONTEND_TYPE">
          <a
            target="_blank"
            :href="`${REPO_EXAMPLE_URL}/${item.name}/src/canvas/${example}${item.file}`"
          >
            <span class="name">{{ item.name }}: </span>
            <span class="link">.../canvas/{{ example }}{{ item.file }}</span>
          </a>
        </li>
      </ul>
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
.description {
  position: absolute;
  padding: 20px;
  top: 0;
  left: 0;
  height: calc(100% - 25px);
  width: 100%;
  backdrop-filter: blur(20px);
  color: white;
  text-shadow:
    -1px 0 black,
    0 1px black,
    1px 0 black,
    0 -1px black;
  font-size: small;
}
.description ul {
  margin-left: 20px;
}
.name {
  display: inline-block;
  min-width: 60px;
}
.link {
  font-size: small;
  color: #c8abfa;
}
</style>
