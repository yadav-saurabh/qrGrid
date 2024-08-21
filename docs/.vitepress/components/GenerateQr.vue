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

import SaurabhImg from "../../assets/yadav-saurabh.png";
import Switch from "./Switch.vue";
import ColorPicker from "./ColorPicker.vue";
import ModuleStyles from "./GenerateQrModuleStyles.vue";
import { ChevronDown, UploadIcon } from "../icons";
import {
  roundCornerOuterFinderPatternPath,
  roundCornerInnerFinderPatternPath,
  smoothDataBitPath,
  isOuterFinderPattern,
} from "./qrStyles";

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

const qrRef = ref<InstanceType<typeof Qr> | null>(null);
const input = ref("https://qrgrid.dev");

const outerFinderStyle = ref<number>(0);
const innerFinderStyle = ref<number>(0);
const codewordStyle = ref<number>(0);

const downloadType = ref<"svg" | "png" | "jpeg" | "webp">("svg");
const downloadDropdown = ref(false);

const finderColor = ref("#ff3131");
const codewordColor = ref("currentColor");
const backgroundColor = ref("transparent");

const imgSrc = ref("");
const imgOverlap = ref(true);
const imgBorder = ref(false);

const outerFinderCorner = new Set<CornerType>();
const innerFinderCorner = new Set<CornerType>();
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
    // outer finder style for #1-#4 & #6-#9
    if (STYLE_CORNER_KEYS.some((d) => outerFinderStyle.value === d)) {
      finder += roundCornerOuterFinderPatternPath(
        module,
        qr,
        outerFinderCorner
      );
    }
    // inner finder style for #1-#4 & #6-#9
    if (STYLE_CORNER_KEYS.some((d) => innerFinderStyle.value === d)) {
      finder += roundCornerInnerFinderPatternPath(
        module,
        qr,
        innerFinderCorner
      );
    }
    // outer finder style for #5
    if (outerFinderStyle.value === 5 && isOuterFinderPattern(module, qr)) {
      finder += getCirclePath(x, y, size);
    }
    // inner finder style for #5
    if (innerFinderStyle.value === 5 && !isOuterFinderPattern(module, qr)) {
      finder += getCirclePath(x, y, size);
    }
    path.finder += finder || getSquarePath(x, y, size);
    return;
  }
  // codeword style for #1-#4 & #6-#9
  if (STYLE_CORNER_KEYS.some((d) => codewordStyle.value === d)) {
    codeword += smoothDataBitPath(module, qr, codewordCorner);
  }
  // codeword style for #5
  if (codewordStyle.value === 5) {
    codeword += getCirclePath(x, y, size);
  }
  path.codeword += codeword || getSquarePath(x, y, size);
}

function setStyle(
  value: number,
  type: "outer-finder" | "inner-finder" | "codeword"
) {
  let styleObj = codewordStyle;
  if (type === "outer-finder") {
    styleObj = outerFinderStyle;
  }
  if (type === "inner-finder") {
    styleObj = innerFinderStyle;
  }
  if (styleObj.value === value) {
    styleObj.value = 0;
    modifyCornerSet(type, "delete", STYLE_CORNER_MAPPING[value]);
    return;
  }
  modifyCornerSet(type, "clear", STYLE_CORNER_MAPPING[value]);
  styleObj.value = value;
  modifyCornerSet(type, "add", STYLE_CORNER_MAPPING[value]);
}

function modifyCornerSet(
  type: "outer-finder" | "inner-finder" | "codeword",
  operation: "add" | "delete" | "clear",
  data?: CornerType[] | undefined
) {
  let set = codewordCorner;
  if (type === "outer-finder") {
    set = outerFinderCorner;
  }
  if (type === "inner-finder") {
    set = innerFinderCorner;
  }
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

const setImageSrc = (img: string) => {
  imgSrc.value = imgSrc.value === img ? "" : img;
};

const onUpload = (event: Event) => {
  if (!event.target) {
    return;
  }
  const target = event.target as HTMLInputElement;
  const files = target.files as FileList;
  imgSrc.value = URL.createObjectURL(files[0]);
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
  window.addEventListener("click", toggleDropdown);
});
onUnmounted(() => {
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
          rows="2"
          cols="50"
          class="input"
        />
        <!-- Finder  -->
        <p class="sub-title">Finder</p>
        <div :style="{ marginLeft: '1rem' }">
          <div class="input-container">
            <label class="label" for="finder-color">Color</label>
            <ColorPicker v-model="finderColor" id="finder-color" />
          </div>
          <ModuleStyles
            label="Outer Style"
            type="outer-finder"
            :styleRef="outerFinderStyle"
            :setStyle="setStyle"
          />
          <ModuleStyles
            label="Inner Style"
            type="inner-finder"
            :styleRef="innerFinderStyle"
            :setStyle="setStyle"
          />
        </div>
        <!-- Codewords  -->
        <p class="sub-title">Codeword</p>
        <div :style="{ marginLeft: '1rem' }">
          <div class="input-container">
            <label class="label" for="codeword-color">Color</label>
            <ColorPicker v-model="codewordColor" id="codeword-color" />
          </div>
          <ModuleStyles
            type="codeword"
            :styleRef="codewordStyle"
            :setStyle="setStyle"
          />
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
        <!-- Image  -->
        <div class="input-container">
          <p class="sub-title" :style="{ margin: 0 }">Image</p>
          <div :style="{ display: 'flex' }">
            <img
              class="img"
              :src="SaurabhImg"
              alt="saurabh yadav"
              @click="() => setImageSrc(SaurabhImg)"
            />
            <div class="btn icon-btn upload-btn-container">
              <UploadIcon stroke="currentcolor" />
              <input
                class="btn icon-btn upload-btn"
                type="file"
                @change="onUpload"
                name="img"
                accept="image/*"
              />
            </div>
          </div>
        </div>
        <div class="input-container" v-if="imgSrc">
          <p class="label" :style="{ margin: 0, paddingLeft: '1rem' }">
            Overlap
          </p>
          <Switch class="img-switch" v-model:checked="imgOverlap" />
        </div>
        <div class="input-container" v-if="imgSrc && !imgOverlap">
          <p class="label" :style="{ margin: 0, paddingLeft: '1rem' }">
            Border
          </p>
          <Switch class="img-switch" v-model:checked="imgBorder" />
        </div>
      </div>
      <div class="qr-container">
        <div>
          <Qr
            class="qr"
            ref="qrRef"
            :bgColor="backgroundColor"
            :input="input"
            :color="{ finder: finderColor, codeword: codewordColor }"
            :moduleStyle="qrModuleStyle"
            :size="999"
            :data-codeword-style="codewordStyle"
            :data-outer-finder-style="outerFinderStyle"
            :data-inner-finder-style="innerFinderStyle"
            :image="{ src: imgSrc, overlap: imgOverlap, border: imgBorder }"
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
  margin: 4px 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}
.label {
  font-size: 14px;
  font-weight: 400;
}
.img {
  height: 45px;
  width: 45px;
  margin: 2px;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
}
.img:hover {
  border-color: var(--vp-c-brand);
}
.img-switch {
  margin: 0;
  padding: 0;
}
.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.qr {
  height: 400px;
  width: 400px;
}
@media (max-width: 960px) {
  .qr {
    height: 300px;
    width: 300px;
  }
}
@media (max-width: 640px) {
  .qr {
    height: 220px;
    width: 220px;
  }
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
.icon-btn {
  height: 45px;
  width: 45px;
}
.upload-btn-container {
  position: relative;
}
.upload-btn {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  opacity: 0;
}
</style>
