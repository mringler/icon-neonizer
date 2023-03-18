<script setup  lang="ts">
import { FillStyle } from '@image-tracer/core';
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
const itemsFillStyle = [
    { title: 'Fill', value: FillStyle.FILL, description: 'Create fully colored shapes.' },
    { title: 'Stroke & Fill', value: FillStyle.STROKE_FILL, description: 'Add additional outline to fully colored shapes.' },
    { title: 'Stroke', value: FillStyle.STROKE, description: 'Outline transparent shapes.' },
]
</script>

<template>
    <v-select
        label="Fill Style"
        v-model="props.options.fillstyle"
        :items="itemsFillStyle"
        required
    ></v-select>
</template>