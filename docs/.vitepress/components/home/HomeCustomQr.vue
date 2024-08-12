<script setup lang="ts">
import { QR, ReservedBits } from "@qrgrid/core";
import { ModuleStyleFunctionParams, Qr } from "@qrgrid/vue/svg";
import { CornerType, getCirclePath, getSquarePath } from "@qrgrid/styles/svg";
import { onMounted, onUnmounted, ref } from "vue";

import ColorPicker from "../ColorPicker.vue";
import Switch from "../Switch.vue";
import {
  SquareTopLeftCircleBorderIcon,
  SquareTopRightCircleBorderIcon,
  SquareBottomLeftCircleBorderIcon,
  SquareBottomRightCircleBorderIcon,
  Circle,
} from "../../icons";
import { roundCornerFinderPatternPath, smoothDataBitPath } from "../qrStyles";

const STYLE_CORNER_MAPPING: Record<number, CornerType> = {
  1: "top-left",
  2: "top-right",
  3: "bottom-right",
  4: "bottom-left",
};

const finderStyle = ref<Set<number>>(new Set());
const codewordStyle = ref<Set<number>>(new Set());
const svgSize = ref(400);
const combinedStyle = ref(false);
const input = ref("https://qrgrid.dev");
const finderColor = ref("#ff3131");
const codewordColor = ref("currentColor");
const backgroundColor = ref("transparent");

const finderCorner = new Set<CornerType>();
const codewordCorner = new Set<CornerType>();

function qrModuleStyle(
  path: ModuleStyleFunctionParams[0],
  module: ModuleStyleFunctionParams[1],
  qr: QR
) {
  const { reservedBits } = qr;
  const { x, y, size } = module;
  let finder = "";
  let codeword = "";

  if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
    // finder style for #1
    if (finderStyle.value.has(1)) {
      finder += roundCornerFinderPatternPath(module, qr, finderCorner);
    }
    // finder style for #2
    if (finderStyle.value.has(2)) {
      finder += roundCornerFinderPatternPath(module, qr, finderCorner);
    }
    // finder style for #3
    if (finderStyle.value.has(3)) {
      finder += roundCornerFinderPatternPath(module, qr, finderCorner);
    }
    // finder style for #4
    if (finderStyle.value.has(4)) {
      finder += roundCornerFinderPatternPath(module, qr, finderCorner);
    }
    // finder style for #5
    if (finderStyle.value.has(5)) {
      finder += getCirclePath(x, y, size);
    }
    path.finder += finder || getSquarePath(x, y, size);
    return;
  }
  // codeword style for #1
  if (codewordStyle.value.has(1)) {
    codeword += smoothDataBitPath(module, qr, codewordCorner);
  }
  // codeword style for #2
  if (codewordStyle.value.has(2)) {
    codeword += smoothDataBitPath(module, qr, codewordCorner);
  }
  // codeword style for #3
  if (codewordStyle.value.has(3)) {
    codeword += smoothDataBitPath(module, qr, codewordCorner);
  }
  // codeword style for #4
  if (codewordStyle.value.has(4)) {
    codeword += smoothDataBitPath(module, qr, codewordCorner);
  }
  // codeword style for #5
  if (codewordStyle.value.has(5)) {
    codeword += getCirclePath(x, y, size);
  }
  path.codeword += codeword || getSquarePath(x, y, size);
}

function setStyle(value: number, type: "finder" | "codeword") {
  const styleObj = type === "finder" ? finderStyle : codewordStyle;
  const set = type === "finder" ? finderCorner : codewordCorner;

  if (styleObj.value.has(value)) {
    styleObj.value.delete(value);
    set.delete(STYLE_CORNER_MAPPING[value]);
    return;
  }
  if (!combinedStyle.value) {
    styleObj.value.clear();
    set.clear();
  }
  styleObj.value.add(value);
  set.add(STYLE_CORNER_MAPPING[value]);
}

function onCombinedStyleChanged(e: Event) {
  const value = (<HTMLInputElement>e.target!).checked;
  combinedStyle.value = value;

  finderStyle.value.clear();
  codewordStyle.value.clear();
  finderCorner.clear();
  codewordCorner.clear();
  if (value) {
    finderStyle.value.add(1);
    codewordStyle.value.add(1);
    finderCorner.add(STYLE_CORNER_MAPPING[1]);
    codewordCorner.add(STYLE_CORNER_MAPPING[1]);
  }
}

function getCanvasSize() {
  const width = window.innerWidth;
  if (width < 640) {
    return 220;
  }
  if (width < 960) {
    return 300;
  }
  return 360;
}

const onWindowResize = () => {
  svgSize.value = getCanvasSize();
};

onMounted(() => {
  svgSize.value = getCanvasSize();
  window.addEventListener("resize", onWindowResize);
});
onUnmounted(() => {
  window.removeEventListener("resize", onWindowResize);
});
</script>

<template>
  <div class="card">
    <div>
      <p class="title">Customize as you want</p>
      <p class="title-desc">
        For more customization option:
        <a href="./generate/">Generate a custom qr</a>
      </p>
      <!-- FInder  -->
      <p class="sub-title">Finder</p>
      <div :style="{ marginLeft: '1rem' }">
        <div class="input-container">
          <label class="label" for="finder-color">Color</label>
          <ColorPicker v-model="finderColor" id="finder-color" />
        </div>
        <div class="input-container style-grid">
          <label class="label" for="finder-style">Style</label>
          <div>
            <button
              type="button"
              class="icon-btn"
              :class="{ active: finderStyle.has(1) }"
              @click="() => setStyle(1, 'finder')"
            >
              <SquareTopLeftCircleBorderIcon />
            </button>
            <button
              type="button"
              class="icon-btn"
              :class="{ active: finderStyle.has(2) }"
              @click="() => setStyle(2, 'finder')"
            >
              <SquareTopRightCircleBorderIcon />
            </button>
            <button
              type="button"
              class="icon-btn"
              :class="{ active: finderStyle.has(3) }"
              @click="() => setStyle(3, 'finder')"
            >
              <SquareBottomRightCircleBorderIcon />
            </button>
            <button
              type="button"
              class="icon-btn"
              :class="{ active: finderStyle.has(4) }"
              @click="() => setStyle(4, 'finder')"
            >
              <SquareBottomLeftCircleBorderIcon />
            </button>
            <button
              type="button"
              class="icon-btn"
              :disabled="combinedStyle"
              :class="{ active: finderStyle.has(5) }"
              @click="() => setStyle(5, 'finder')"
            >
              <Circle />
            </button>
          </div>
        </div>
      </div>
      <!-- Codewords  -->
      <p class="sub-title">Codeword</p>
      <div :style="{ marginLeft: '1rem' }">
        <div class="input-container">
          <label class="label" for="codeword-color">Color</label>
          <ColorPicker v-model="codewordColor" id="codeword-color" />
        </div>
        <div class="input-container">
          <label class="label" for="codeword-style">Style</label>
          <div>
            <button
              type="button"
              class="icon-btn"
              :class="{ active: codewordStyle.has(1) }"
              @click="() => setStyle(1, 'codeword')"
            >
              <SquareTopLeftCircleBorderIcon />
            </button>
            <button
              type="button"
              class="icon-btn"
              :class="{ active: codewordStyle.has(2) }"
              @click="() => setStyle(2, 'codeword')"
            >
              <SquareTopRightCircleBorderIcon />
            </button>
            <button
              type="button"
              class="icon-btn"
              :class="{ active: codewordStyle.has(3) }"
              @click="() => setStyle(3, 'codeword')"
            >
              <SquareBottomRightCircleBorderIcon />
            </button>
            <button
              type="button"
              class="icon-btn"
              :class="{ active: codewordStyle.has(4) }"
              @click="() => setStyle(4, 'codeword')"
            >
              <SquareBottomLeftCircleBorderIcon />
            </button>
            <button
              type="button"
              class="icon-btn"
              :disabled="combinedStyle"
              :class="{ active: codewordStyle.has(5) }"
              @click="() => setStyle(5, 'codeword')"
            >
              <Circle />
            </button>
          </div>
        </div>
      </div>
      <!-- Background Color  -->
      <div class="input-container" :style="{ marginTop: '16px' }">
        <p class="sub-title" :style="{ margin: 0 }">Background Color</p>
        <div>
          <label
            class="label"
            for="background-color"
            :style="{ display: 'none' }"
            >Color</label
          >
          <ColorPicker v-model="backgroundColor" id="background-color" />
        </div>
      </div>
      <!-- Combine Styles  -->
      <div class="input-container" :style="{ marginTop: '16px' }">
        <p class="sub-title" :style="{ margin: 0 }">Combine Styles</p>
        <label
          class="label"
          for="background-color"
          :style="{ display: 'none' }"
        ></label>
        <Switch
          label="Combine Styles"
          @change="onCombinedStyleChanged"
          v-model:checked="combinedStyle"
        />
      </div>
    </div>
    <div class="qr-container">
      <Qr
        :bgColor="backgroundColor"
        :input="input"
        :color="{ finder: finderColor, codeword: codewordColor }"
        :moduleStyle="qrModuleStyle"
        :size="svgSize"
        :data-codeword-style="[...codewordStyle].join()"
        :data-finder-style="[...finderStyle].join()"
      />
    </div>
  </div>
</template>

<style scoped>
.card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  margin-top: 60px;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  padding: 24px;
  text-decoration: none;
}
.title {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 0;
}
.title-desc {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
.input-container {
  margin: 4px;
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
.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
