<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
const description = 'Maximum allowed change to pixel value through blur. Must be between 0 (no change) and 1020 (255 for each channel, any change is fine).'
</script>

<template>
    <v-text-field
        label="Blur Delta"
        v-model="props.options.blurdelta"
        type="number"
        step="10"
        min="0"
        max="1020"
    ></v-text-field>
</template>