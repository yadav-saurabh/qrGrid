<script setup lang="ts">
import { Qr, QrProps } from "@qrgrid/vue/svg";

const props = defineProps<{
  input: string;
  qrOptions?: QrProps["qrOptions"];
}>();
</script>

<template>
  <Qr :input="props.input" :qrOptions="props.qrOptions" />
</template>
