<script setup lang="ts">
defineProps<{
  checked: boolean;
}>();
</script>

<template>
  <label class="container">
    <input
      v-bind="$attrs"
      class="input"
      type="checkbox"
      :checked="checked"
      @change="
        $emit('update:checked', (<HTMLInputElement>$event.target!).checked)
      "
    />
    <span class="switch"></span>
  </label>
</template>

<style scoped>
.container {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.label {
  margin-left: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* Visually hide the checkbox input */
.input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
.switch {
  display: flex;
  align-items: center;
  position: relative;
  height: 25px;
  flex-basis: 50px;
  border-radius: 25px;
  background-color: var(--vp-c-default-soft);
  flex-shrink: 0;
  transition: background-color 0.25s ease-in-out;
}
.switch::before {
  content: "";
  position: absolute;
  left: 1px;
  height: calc(25px - 4px);
  width: calc(25px - 4px);
  border-radius: 9999px;
  background-color: white;
  border: 2px solid var(--vp-c-default-soft);
  transition: transform 0.375s ease-in-out;
}
.input:checked + .switch {
  background-color: var(--vp-c-brand-2);
}
.input:checked + .switch::before {
  border-color: var(--vp-c-brand-2);
  transform: translateX(25px);
}
.input:focus:checked + .switch::before {
  border-color: var(--vp-c-brand-3);
}
</style>
