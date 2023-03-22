<script setup  lang="ts">
import { toRef } from 'vue';
import { CreatePaletteMode } from '@image-tracer/core';
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';
import { useInputConfig } from '@/composables/inputConfig'

const props = withDefaults(defineProps<{
    options: GradientDrawerOptions,
    showHelp: boolean,
}>(), {
    showHelp: false
})

const description = 'Select how colors in the image are determined.'
const itemsColorSampling = [
    { title: 'Use generated palette', value: CreatePaletteMode.GENERATE, description: 'Picks equidistant points from the color spectrum. Uses grey if less than 8 colors are requested.' },
    { title: 'Sample image randomly', value: CreatePaletteMode.SAMPLE, description: 'Picks color from a random pixel until number of requested unique colors are found.' },
    { title: 'Sample image along grid', value: CreatePaletteMode.SCAN, description: 'Puts a grid on the image and pick colors from the intersections. Add random colors if not enough unique colors are found.' },
    { title: 'Choose colors', value: CreatePaletteMode.PALETTE, description: 'Use only provided colors.' },
]
const inputConfig = useInputConfig(toRef(props, 'showHelp'), { description, tableData: { data: itemsColorSampling, keys:  {title: 'Option', description: 'Description'} }})
</script>

<template>
    <v-select
        label="Sampling Mode"
        v-model="props.options.colorSamplingMode"
        :items="itemsColorSampling"
        required
        v-bind="inputConfig.attrs"
    >
        <template
            v-for="(InputSlot, slotName) in inputConfig.slots"
            :key="slotName"
            v-slot:[slotName]
        >
            <Component :is="InputSlot" />
        </template>
    </v-select>
</template>