<script setup lang="ts">
import { Qr, QrProps } from "@qrgrid/vue/svg";
import { QR } from "@qrgrid/core";
import { ref } from "vue";
import { downloadQr } from "@qrgrid/styles/svg";

const props = defineProps<{
  input: string;
  qrOptions?: QrProps["qrOptions"];
}>();

const qrData = ref<QR>();
const qrRef = ref<InstanceType<typeof Qr> | null>(null);

function setQrData(qr: QR) {
  qrData.value = qr;
}

function download() {
  if (qrRef.value?.svgRef) {
    downloadQr(qrRef.value?.svgRef);
  }
}
</script>

<template>
  <div className="defaultQrContainer">
    <div style="position: relative; left: -4rem">
      <h2>Default Qr</h2>
      Version: {{ qrData?.version || 0 }}
      <br />
      Size: {{ qrData?.gridSize || 0 }}
      <br />
      Error Correction: {{ qrData?.errorCorrection || "N.A" }}
      <br />
      Total bits size: {{ (qrData?.data || []).length }}
      <br />
      Reserved bits length: {{ Object.keys(qrData?.reservedBits || {}).length }}
      <br />
      Segments:
      <br />
      <span className="segments">
        <template
          v-for="(d, i) in qrData?.segments"
          :item="d"
          :index="i"
          :key="i"
        >
          <b>{{ d.mode }}</b> - <span>{{ d.value }}</span>
          <br />
        </template>
      </span>
      <div>
        <button type="button" @click="download">Download</button>
      </div>
    </div>
    <Qr
      ref="qrRef"
      :input="props.input"
      :qrOptions="props.qrOptions"
      :getQrData="setQrData"
    />
  </div>
</template>
