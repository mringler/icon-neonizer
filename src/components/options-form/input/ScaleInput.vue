<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
const description = "SVG coordinates are multiplied by this number. Particularly useful when strokes appear to thick."
</script>

<template>
    <v-text-field
        label="Scale"
        v-model="props.options.scale"
        required
        type="number"
        step="1"
        min="0"
    ></v-text-field>
</template>