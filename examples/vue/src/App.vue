<script setup lang="ts">
import { ref } from "vue";
import { ErrorCorrectionLevel, ErrorCorrectionLevelType } from "@qrgrid/core";

import Canvas from "./canvas/Index.vue";
import Svg from "./svg/Index.vue";

const input = ref("");
const errorCorrection = ref<ErrorCorrectionLevelType>("M");

const FINDER_COLOR = "#ff3131";
</script>

<template>
  <div className="inputContainer">
    <textarea
      placeholder="Text To Encode"
      v-model="input"
      :rows="4"
      :cols="50"
    />
    <select
      name="errorCorrection"
      id="errorCorrection"
      :defaultValue="ErrorCorrectionLevel.M"
      v-model="errorCorrection"
    >
      <option disabled>Choose a ErrorCorrectionLevel</option>
      <option
        v-for="ec in Object.keys(ErrorCorrectionLevel)"
        :key="ec"
        :value="ec"
      >
        {{ ec }}
      </option>
    </select>
  </div>
  <h2 :style="{ margin: '2rem', borderBottom: '1px solid' }">Using Canvas</h2>
  <Canvas
    :input="input"
    :qrOptions="{ errorCorrection }"
    :finderColor="FINDER_COLOR"
  />
  <h2 :style="{ margin: '2rem', borderBottom: '1px solid' }">Using Svg</h2>
  <Svg
    :input="input"
    :qrOptions="{ errorCorrection }"
    :finderColor="FINDER_COLOR"
  />
</template>
