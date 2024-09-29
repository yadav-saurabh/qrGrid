<script setup lang="ts">
import { Qr } from "@qrgrid/vue/svg";

const props = defineProps<{
  input: string;
  finderColor: string;
}>();
</script>

<template>
  <Qr :input="props.input" :color="{ finder: finderColor }" />
</template>
