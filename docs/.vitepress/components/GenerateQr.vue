<script setup lang="ts">
import { QR, ReservedBits } from "@qrgrid/core";
import { ModuleStyleFunctionParams, Qr } from "@qrgrid/vue/svg";
import {
  CornerType,
  getCirclePath,
  getSquarePath,
  downloadQr,
} from "@qrgrid/styles/svg";
import { onMounted, onUnmounted, ref } from "vue";

import ColorPicker from "./ColorPicker.vue";
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
  ChevronDown,
} from "../icons";
import { roundCornerFinderPatternPath, smoothDataBitPath } from "./qrStyles";

const STYLE_CORNER_MAPPING: Record<number, CornerType[]> = {
  1: ["top-left"],
  2: ["top-right"],
  3: ["bottom-right"],
  4: ["bottom-left"],
  6: ["top-left", "top-right"],
  7: ["bottom-left", "bottom-right"],
  8: ["top-right", "bottom-right"],
  9: ["top-left", "bottom-left"],
  10: ["top-right", "bottom-right", "top-left", "bottom-left"],
  11: ["bottom-right", "top-left"],
  12: ["top-right", "bottom-left"],
};

const STYLE_CORNER_KEYS = Object.keys(STYLE_CORNER_MAPPING).map((d) => +d);

const finderStyle = ref<Set<number>>(new Set());
const codewordStyle = ref<Set<number>>(new Set());
const svgSize = ref(400);
const qrRef = ref<InstanceType<typeof Qr> | null>(null);
const downloadType = ref<"svg" | "png" | "jpeg" | "webp">("svg");
const downloadDropdown = ref(false);
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
    // finder style for #1-#4 & #6-#9
    if (STYLE_CORNER_KEYS.some((d) => finderStyle.value.has(d))) {
      finder += roundCornerFinderPatternPath(module, qr, finderCorner);
    }
    // finder style for #5
    if (finderStyle.value.has(5)) {
      finder += getCirclePath(x, y, size);
    }
    path.finder += finder || getSquarePath(x, y, size);
    return;
  }
  // codeword style for #1-#4 & #6-#9
  if (STYLE_CORNER_KEYS.some((d) => codewordStyle.value.has(d))) {
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
  if (styleObj.value.has(value)) {
    styleObj.value.delete(value);
    modifyCornerSet(type, "delete", STYLE_CORNER_MAPPING[value]);
    return;
  }
  styleObj.value.clear();
  modifyCornerSet(type, "clear", STYLE_CORNER_MAPPING[value]);
  styleObj.value.add(value);
  modifyCornerSet(type, "add", STYLE_CORNER_MAPPING[value]);
}

function modifyCornerSet(
  type: "finder" | "codeword",
  operation: "add" | "delete" | "clear",
  data?: CornerType[] | undefined
) {
  const set = type === "finder" ? finderCorner : codewordCorner;
  if (operation === "clear") {
    set.clear();
  }
  if (!data) {
    return;
  }
  for (let i = 0; i < data.length; i++) {
    set[operation](data[i]);
  }
}

function onDownload() {
  if (qrRef.value?.svgRef) {
    downloadQr(qrRef.value?.svgRef, downloadType.value, "qrGrid");
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

const toggleDropdown = (event: Event) => {
  if (!event?.target) {
    return;
  }
  const elem = event.target as Element;
  if (elem.matches(".dropdown-btn") || elem.matches(".dropdown-btn-icon")) {
    downloadDropdown.value = !downloadDropdown.value;
  } else {
    downloadDropdown.value = false;
  }
};

onMounted(() => {
  svgSize.value = getCanvasSize();
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("click", toggleDropdown);
});
onUnmounted(() => {
  window.removeEventListener("resize", onWindowResize);
  window.removeEventListener("click", toggleDropdown);
});
</script>

<template>
  <div class="container">
    <div class="card">
      <div>
        <p class="title">Generate a QR</p>
        <!-- Input  -->
        <textarea
          placeholder="Text To Encode"
          v-model="input"
          rows="{4}"
          cols="{50}"
          class="input"
        />
        <!-- Finder  -->
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
                :class="{ active: finderStyle.has(5) }"
                @click="() => setStyle(5, 'finder')"
              >
                <Circle />
              </button>
              <button
                type="button"
                class="icon-btn"
                :class="{ active: finderStyle.has(6) }"
                @click="() => setStyle(6, 'finder')"
              >
                <SquareTopCircleBorderIcon />
              </button>
              <button
                type="button"
                class="icon-btn"
                :class="{ active: finderStyle.has(7) }"
                @click="() => setStyle(7, 'finder')"
              >
                <SquareBottomCircleBorderIcon />
              </button>
              <button
                type="button"
                class="icon-btn"
                :class="{ active: finderStyle.has(8) }"
                @click="() => setStyle(8, 'finder')"
              >
                <SquareRightCircleBorderIcon />
              </button>
              <button
                type="button"
                class="icon-btn"
                :class="{ active: finderStyle.has(9) }"
                @click="() => setStyle(9, 'finder')"
              >
                <SquareLeftCircleBorderIcon />
              </button>
              <button
                type="button"
                class="icon-btn"
                :class="{ active: finderStyle.has(10) }"
                @click="() => setStyle(10, 'finder')"
              >
                <SquareCircleBorderIcon />
              </button>
              <button
                type="button"
                class="icon-btn"
                :class="{ active: finderStyle.has(11) }"
                @click="() => setStyle(11, 'finder')"
              >
                <SquareTopLeftBottomRightCircleBorderIcon />
              </button>
              <button
                type="button"
                class="icon-btn"
                :class="{ active: finderStyle.has(12) }"
                @click="() => setStyle(12, 'finder')"
              >
                <SquareBottomLeftTopRightCircleBorderIcon />
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
                :class="{ active: codewordStyle.has(5) }"
                @click="() => setStyle(5, 'codeword')"
              >
                <Circle />
              </button>
              <button
                type="button"
                class="icon-btn"
                :class="{ active: codewordStyle.has(6) }"
                @click="() => setStyle(6, 'codeword')"
              >
                <SquareTopCircleBorderIcon />
              </button>
              <button
                type="button"
                class="icon-btn"
                :class="{ active: codewordStyle.has(7) }"
                @click="() => setStyle(7, 'codeword')"
              >
                <SquareBottomCircleBorderIcon />
              </button>
              <button
                type="button"
                class="icon-btn"
                :class="{ active: codewordStyle.has(8) }"
                @click="() => setStyle(8, 'codeword')"
              >
                <SquareRightCircleBorderIcon />
              </button>
              <button
                type="button"
                class="icon-btn"
                :class="{ active: codewordStyle.has(9) }"
                @click="() => setStyle(9, 'codeword')"
              >
                <SquareLeftCircleBorderIcon />
              </button>
              <button
                type="button"
                class="icon-btn"
                :class="{ active: codewordStyle.has(10) }"
                @click="() => setStyle(10, 'codeword')"
              >
                <SquareCircleBorderIcon />
              </button>
              <button
                type="button"
                class="icon-btn"
                :class="{ active: codewordStyle.has(11) }"
                @click="() => setStyle(11, 'codeword')"
              >
                <SquareTopLeftBottomRightCircleBorderIcon />
              </button>
              <button
                type="button"
                class="icon-btn"
                :class="{ active: codewordStyle.has(12) }"
                @click="() => setStyle(12, 'codeword')"
              >
                <SquareBottomLeftTopRightCircleBorderIcon />
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
      </div>
      <div class="qr-container">
        <div>
          <Qr
            ref="qrRef"
            :bgColor="backgroundColor"
            :input="input"
            :color="{ finder: finderColor, codeword: codewordColor }"
            :moduleStyle="qrModuleStyle"
            :size="svgSize"
            :data-codeword-style="[...codewordStyle].join()"
            :data-finder-style="[...finderStyle].join()"
          />
          <div class="btn-container">
            <button class="btn" @click="onDownload">
              Download .{{ downloadType }}
            </button>
            <button class="dropdown-btn">
              <ChevronDown class="dropdown-btn-icon" />
            </button>
            <div
              class="dropdown-list"
              :style="{ display: downloadDropdown ? 'block' : 'none' }"
            >
              <button @click="downloadType = 'svg'">svg</button>
              <button @click="downloadType = 'png'">png</button>
              <button @click="downloadType = 'jpeg'">jpeg</button>
              <button @click="downloadType = 'webp'">webp</button>
            </div>
          </div>
        </div>
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
  padding: 24px;
  text-decoration: none;
}
@media (min-width: 640px) {
  .card {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
}
.title {
  font-size: 24px;
  font-weight: 500;
  color: var(--vp-c-brand);
  margin-bottom: 10px;
}
.input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--vp-c-default-soft);
  border-radius: 8px;
  background-color: var(--vp-c-default-soft);
  margin-bottom: 14px;
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
.btn-container {
  display: flex;
  position: relative;
}
.btn-container .icon-btn {
  margin-left: 0;
  margin-right: 0;
}
.btn {
  width: 100%;
  padding: 10px;
  margin: 2px;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: var(--vp-button-alt-bg);
}
.dropdown-btn {
  padding: 10px;
  margin: 2px;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: var(--vp-c-default-soft);
}
.dropdown-list {
  position: absolute;
  display: none;
  z-index: 100;
  top: 100%;
  width: 100%;
  padding: 10px;
  margin: 2px;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: var(--vp-button-alt-bg);
}
.dropdown-btn:hover,
.btn:hover,
.dropdown:hover {
  border-color: var(--vp-c-brand);
}
.dropdown-list button {
  display: block;
  border-radius: 8px;
  width: 100%;
  color: var(--vp-button-alt-text);
  border: 1px solid var(--vp-button-alt-border);
  text-align: left;
  padding: 5px 10px;
}
.dropdown-list button:hover {
  background-color: var(--vp-c-brand-2);
}
</style>
