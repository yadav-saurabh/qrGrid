<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: string;
  id: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<template>
  <div class="color-picker">
    <div class="color-input-wrapper">
      <input
        type="color"
        :id="id"
        :name="id"
        class="color-input"
        v-model="value"
      />
    </div>
    <input
      type="text"
      :id="`${id}-input`"
      :name="`${id}-input`"
      class="color-input-text"
      aria-label="Color picker input"
      v-model="value"
    />
  </div>
</template>

<style scoped>
.color-input {
  width: 34px;
  height: 34px;
  position: absolute;
  top: -5px;
  left: -5px;
}
.color-input-wrapper {
  height: 24px;
  width: 24px;
  overflow: hidden;
  position: relative;
  border-radius: 12px;
  flex-shrink: 0;
}
.color-picker {
  background: var(--vp-c-default-soft);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  padding: 4px 8px;
  height: auto;
  font-size: 14px;
  text-align: left;
  border: 1px solid transparent;
  cursor: text;
  display: flex;
  align-items: center;
  gap: 2px;
}

.color-input-text {
  width: 100%;
  height: 100%;
  padding: 0 0 0 8px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 14px;
  text-align: left;
  border-radius: 8px;
  cursor: text;
  transition:
    border-color 0.25s,
    background 0.4s ease;
}

.color-picker:hover,
.color-picker:focus {
  border-color: var(--vp-c-brand);
  /* background: var(--vp-c-bg-alt); */
}
</style>
