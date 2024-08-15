<script setup lang="ts">
import {
  SquareTopLeftCircleBorderIcon,
  SquareTopRightCircleBorderIcon,
  SquareBottomLeftCircleBorderIcon,
  SquareBottomRightCircleBorderIcon,
  SquareTopCircleBorderIcon,
  SquareBottomCircleBorderIcon,
  SquareRightCircleBorderIcon,
  SquareLeftCircleBorderIcon,
  SquareCircleBorderIcon,
  SquareTopLeftBottomRightCircleBorderIcon,
  SquareBottomLeftTopRightCircleBorderIcon,
  Circle,
} from "../icons";

defineProps<{
  label?: string;
  type: "outer-finder" | "inner-finder" | "codeword";
  setStyle: (
    value: number,
    type: "outer-finder" | "inner-finder" | "codeword"
  ) => void;
  styleRef: number;
}>();
</script>

<template>
  <div class="input-container">
    <label class="label" :for="type + '-style'">{{ label || "Style" }}</label>
    <div>
      <button
        type="button"
        class="icon-btn"
        :class="{ active: styleRef === 1 }"
        @click="() => setStyle(1, type)"
      >
        <SquareTopLeftCircleBorderIcon />
      </button>
      <button
        type="button"
        class="icon-btn"
        :class="{ active: styleRef === 2 }"
        @click="() => setStyle(2, type)"
      >
        <SquareTopRightCircleBorderIcon />
      </button>
      <button
        type="button"
        class="icon-btn"
        :class="{ active: styleRef === 3 }"
        @click="() => setStyle(3, type)"
      >
        <SquareBottomRightCircleBorderIcon />
      </button>
      <button
        type="button"
        class="icon-btn"
        :class="{ active: styleRef === 4 }"
        @click="() => setStyle(4, type)"
      >
        <SquareBottomLeftCircleBorderIcon />
      </button>
      <button
        type="button"
        class="icon-btn"
        :class="{ active: styleRef === 5 }"
        @click="() => setStyle(5, type)"
      >
        <Circle />
      </button>
      <button
        type="button"
        class="icon-btn"
        :class="{ active: styleRef === 6 }"
        @click="() => setStyle(6, type)"
      >
        <SquareTopCircleBorderIcon />
      </button>
      <button
        type="button"
        class="icon-btn"
        :class="{ active: styleRef === 7 }"
        @click="() => setStyle(7, type)"
      >
        <SquareBottomCircleBorderIcon />
      </button>
      <button
        type="button"
        class="icon-btn"
        :class="{ active: styleRef === 8 }"
        @click="() => setStyle(8, type)"
      >
        <SquareRightCircleBorderIcon />
      </button>
      <button
        type="button"
        class="icon-btn"
        :class="{ active: styleRef === 9 }"
        @click="() => setStyle(9, type)"
      >
        <SquareLeftCircleBorderIcon />
      </button>
      <button
        type="button"
        class="icon-btn"
        :class="{ active: styleRef === 10 }"
        @click="() => setStyle(10, type)"
      >
        <SquareCircleBorderIcon />
      </button>
      <button
        type="button"
        class="icon-btn"
        :class="{ active: styleRef === 11 }"
        @click="() => setStyle(11, type)"
      >
        <SquareTopLeftBottomRightCircleBorderIcon />
      </button>
      <button
        type="button"
        class="icon-btn"
        :class="{ active: styleRef === 12 }"
        @click="() => setStyle(12, type)"
      >
        <SquareBottomLeftTopRightCircleBorderIcon />
      </button>
    </div>
  </div>
</template>

<style scoped>
.input-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}
.label {
  font-size: 14px;
  font-weight: 400;
}
.icon-btn {
  padding: 10px;
  margin: 2px;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: var(--vp-c-default-soft);
}
.icon-btn[disabled] {
  background-color: var(--vp-c-default-2);
  cursor: not-allowed;
}
.icon-btn:hover {
  border-color: var(--vp-c-brand);
}
.icon-btn.active {
  background: var(--vp-c-bg-alt);
}
</style>
