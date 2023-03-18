<script setup  lang="ts">
import { CreatePaletteMode } from '@image-tracer/core';
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()

const description = 'Select how colors in the image are determined.'
const itemsColorSampling = [
    { title: 'Use generated palette', value: CreatePaletteMode.GENERATE, description: 'Picks equidistant points from the color spectrum. Uses grey if less than 8 colors are requested.' },
    { title: 'Sample image randomly', value: CreatePaletteMode.SAMPLE, description: 'Picks color from a random pixel until number of requested unique colors are found.' },
    { title: 'Sample image along grid', value: CreatePaletteMode.SCAN, description: 'Puts a grid on the image and pick colors from the intersections. Add random colors if not enough unique colors are found.'},
    { title: 'Choose colors', value: CreatePaletteMode.PALETTE, description: 'Use only provided colors.' },
]
</script>

<template>
    <v-select
        label="Sampling Mode"
        v-model="props.options.colorsampling"
        :items="itemsColorSampling"
        required
    ></v-select>
</template>