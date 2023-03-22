<script setup  lang="ts">
import { toRef } from 'vue';
import { FillStyle } from '@image-tracer/core';
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';
import { useInputConfig } from '@/composables/inputConfig'

const props = withDefaults(defineProps<{
    options: GradientDrawerOptions,
    showHelp: boolean,
}>(), {
    showHelp: false
})

const description = 'Select how color segments are colored.'
const itemsFillStyle = [
    { title: 'Fill', value: FillStyle.FILL, description: 'Create fully colored shapes.' },
    { title: 'Stroke & Fill', value: FillStyle.STROKE_FILL, description: 'Add additional outline to fully colored shapes.' },
    { title: 'Stroke', value: FillStyle.STROKE, description: 'Outline transparent shapes.' },
]
const inputConfig = useInputConfig(toRef(props, 'showHelp'), { description, tableData: { data: itemsFillStyle, keys:  {title: 'Option', description: 'Description'} }})
</script>

<template>
    <v-select
        label="Fill Style"
        v-model="props.options.fillStyle"
        :items="itemsFillStyle"
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