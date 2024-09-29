<script setup lang="ts">
import { QrProps } from "@qrgrid/vue/canvas";

import Default from "./Default.vue";
import E_01 from "./E_01.vue";
import E_02 from "./E_02.vue";
import E_03 from "./E_03.vue";
import E_04 from "./E_04.vue";
import E_05 from "./E_05.vue";
import E_06 from "./E_06.vue";

const props = defineProps<{
  input: string;
  qrOptions?: QrProps["qrOptions"];
  finderColor: string;
}>();
</script>

<template>
  <Default :input="props.input" :qrOptions="props.qrOptions" />
  <div class="qrContainer">
    <div class="qr">
      <E_01
        :input="props.input"
        :qrOptions="props.qrOptions"
        :finderColor="props.finderColor"
      />
      <p>E 01</p>
    </div>
    <div class="qr">
      <E_02
        :input="props.input"
        :qrOptions="props.qrOptions"
        :finderColor="props.finderColor"
      />
      <p>E 02</p>
    </div>
    <div class="qr">
      <E_03
        :input="props.input"
        :qrOptions="props.qrOptions"
        :finderColor="props.finderColor"
      />
      <p>E 03</p>
    </div>
    <div class="qr">
      <E_04
        :input="props.input"
        :qrOptions="props.qrOptions"
        :finderColor="props.finderColor"
      />
      <p>E 04</p>
    </div>
    <div class="qr">
      <E_05
        :input="props.input"
        :qrOptions="props.qrOptions"
        :finderColor="props.finderColor"
      />
      <p>E 05</p>
    </div>
    <div class="qr">
      <E_06
        :input="props.input"
        :qrOptions="props.qrOptions"
        :finderColor="props.finderColor"
      />
      <p>E 06</p>
    </div>
  </div>
</template>
