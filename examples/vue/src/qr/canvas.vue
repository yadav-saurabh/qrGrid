<script setup lang="ts">
import { Qr, QrProps } from "@qrgrid/vue/canvas";
import { QR, ReservedBits } from "@qrgrid/core";
import { ref } from "vue";
import {
  dotModuleStyle,
  smoothModuleStyle,
  downloadQr,
  getNeighbor,
  roundCorner,
} from "@qrgrid/styles/canvas";

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
  if (qrRef.value?.canvasRef) {
    downloadQr(qrRef.value?.canvasRef);
  }
}

function qrModuleStyleA(
  ctx: CanvasRenderingContext2D,
  module: { index: number; x: number; y: number; size: number },
  { reservedBits }: QR
) {
  if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
    ctx.fillStyle = "#36BA98";
  }
  ctx.fillRect(module.x, module.y, module.size, module.size);
  ctx.fillStyle = "white";
}

function qrModuleStyleB(
  ctx: CanvasRenderingContext2D,
  module: { index: number; x: number; y: number; size: number },
  qr: QR
) {
  const { reservedBits } = qr;
  const neighbor = getNeighbor(module.index, qr);

  if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
    ctx.fillStyle = "#C73659";
    if (!neighbor.top && !neighbor.right) {
      roundCorner(ctx, module, ["top-right"]);
      return;
    }
    if (!neighbor.bottom && !neighbor.left) {
      roundCorner(ctx, module, ["bottom-left"]);
      return;
    }
    ctx.fillRect(module.x, module.y, module.size, module.size);
    return;
  }
  ctx.fillStyle = "#7E8EF1";
  dotModuleStyle(ctx, module);
}

function gradBg(ctx: CanvasRenderingContext2D) {
  const { height, width } = ctx.canvas;
  const grad = ctx.createLinearGradient(0, 0, height, width);
  grad.addColorStop(0, "lightblue");
  grad.addColorStop(1, "darkblue");
  return grad;
}
</script>

<template>
  <!--  ====== default codes ======  -->
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
  <!--  ========== module style ==========  -->
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
        :moduleStyle="qrModuleStyleA"
      />
      <p>ModuleStyle:- Custom qrModuleStyleA</p>
    </div>
    <div className="qr">
      <Qr
        :input="input"
        :qrOptions="props.qrOptions"
        :moduleStyle="qrModuleStyleB"
      />
      <p>ModuleStyle:- Custom qrModuleStyleB</p>
    </div>
    <!-- {/* ======= theme and color ======== */} -->
    <div className="qr">
      <Qr
        :input="input"
        :qrOptions="props.qrOptions"
        bgColor="white"
        color="black"
      />
      <p>BgColor:- white Color:- black</p>
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
        :moduleStyle="smoothModuleStyle"
        :bgColor="gradBg"
      />
      <p>BgColor,Color:- Custom Theme</p>
    </div>
    <!-- {/* ======= image ======== */} -->
    <div className="qr">
      <Qr
        :input="input"
        :qrOptions="props.qrOptions"
        :moduleStyle="qrModuleStyleA"
        :image="{ src: './vite.svg' }"
      />
      <p>image:- with image in between</p>
    </div>
    <div className="qr">
      <Qr
        :input="input"
        :qrOptions="props.qrOptions"
        :moduleStyle="qrModuleStyleA"
        :image="{ src: './vite.svg', overlap: false }"
      />
      <p>image:- overlap: false</p>
    </div>
  </div>
</template>
