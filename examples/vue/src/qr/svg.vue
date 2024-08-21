<script setup lang="ts">
import { QR, ReservedBits } from "@qrgrid/core";
import {
  dotModuleStyle,
  downloadQr,
  getCirclePath,
  getCornerArcPath,
  getNeighbor,
  getRoundCornerPath,
  getSquarePath,
  smoothModuleStyle,
} from "@qrgrid/styles/svg";
import { ModuleStyleFunctionParams, Qr, QrProps } from "@qrgrid/vue/svg";
import { ref } from "vue";

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

const qrModuleStyle = (
  path: ModuleStyleFunctionParams[0],
  module: ModuleStyleFunctionParams[1],
  qr: QR
) => {
  const { reservedBits } = qr;
  const { x, y, size } = module;
  const neighbor = getNeighbor(module.index, qr);
  const cornerDist = size * 0.9;

  if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
    if (!neighbor.top && !neighbor.left) {
      path.finder += getRoundCornerPath(module, ["top-left"], cornerDist);
      if (!neighbor.bottomRight) {
        const arcCoords = { ...module, y: y + size, x: x + size };
        path.finder += getCornerArcPath(arcCoords, "top-left", cornerDist);
      }
      return;
    }
    if (!neighbor.bottom && !neighbor.right) {
      path.finder += getRoundCornerPath(module, ["bottom-right"]);
      if (!neighbor.topLeft) {
        path.finder += getCornerArcPath(module, "bottom-right", cornerDist);
      }
      return;
    }
    path.finder += getSquarePath(x, y, size);
    return;
  }
  path.codeword += getCirclePath(x, y, size);
};
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
  <div className="qrContainer">
    <div className="qr">
      <Qr
        :input="input"
        :qrOptions="props.qrOptions"
        :moduleStyle="dotModuleStyle"
      />
      <p>ModuleStyle:- styles/dotModuleStyle</p>
    </div>
    <div className="qr">
      <Qr
        :input="input"
        :qrOptions="props.qrOptions"
        :moduleStyle="smoothModuleStyle"
      />
      <p>ModuleStyle:- styles/smoothModuleStyle</p>
    </div>
    <div className="qr">
      <Qr
        :input="input"
        :qrOptions="props.qrOptions"
        :moduleStyle="qrModuleStyle"
        :color="{ finder: '#C73659', codeword: '#7E8EF1' }"
      />
      <p>ModuleStyle:- custom qrModuleStyle</p>
    </div>
    <div className="qr">
      <Qr
        :input="input"
        :qrOptions="props.qrOptions"
        bgColor="#F8EDED"
        color="#173B45"
      />
      <p>BgColor:- #F8EDED Color:- #173B45</p>
    </div>
    <div className="qr">
      <Qr
        :input="input"
        :qrOptions="props.qrOptions"
        bgColor="white"
        :color="{ finder: '#36BA98', codeword: '#173B45' }"
      />
      <p>
        BgColor:- white <br />
        Color:- finder: "#36BA98" codeword: "#173B45"
      </p>
    </div>
    <div className="qr">
      <Qr
        :input="input"
        :qrOptions="props.qrOptions"
        :image="{ src: './vite.svg' }"
      />
      <p>image:- with image in between</p>
    </div>
    <div className="qr">
      <Qr
        :input="input"
        :qrOptions="props.qrOptions"
        :image="{ src: './vite.svg', overlap: false }"
      />
      <p>image:- overlap: false</p>
    </div>
  </div>
</template>
