<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
  options: GradientDrawerOptions,
}>()
const description = 'Further brighten colors by removing transparency. If opacity of a color is above the given threshold, it will be changed to full opacity. Value are between 0 (fully transparent) and 1 (fully opaque).'
</script>

<template>
  <v-text-field
    label="Full Opacity Threshold"
    v-model="props.options.fullOpacityThreshold"
    type="number"
    step="0.1"
    min="0"
    max="1"
  ></v-text-field>
</template>