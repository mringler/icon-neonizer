<script setup  lang="ts">
import { toRef } from 'vue';
import { GradientBuilderOption } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';
import { useInputConfig } from '@/composables/inputConfig'

const props = withDefaults(defineProps<{
    options: GradientDrawerOptions,
    showHelp: boolean,
}>(), {
    showHelp: false
})

const description = 'Defines the direction of the generated color gradients.'
const gradientDrawerOptions = [
    { title: 'Random', value: GradientBuilderOption.random, description: 'Pick a random direction for each color gradient.' },
    { title: 'Fixed', value: GradientBuilderOption.fixed, description: 'Use the same direction for each gradient, every element gets full range.' },
    { title: 'Flat', value: GradientBuilderOption.flat, description: 'Use the same direction for each gradient, gradient spans the image rather then element so element coloring depends on position.' },
]
const inputConfig = useInputConfig(toRef(props, 'showHelp'), { description, tableData: { data: gradientDrawerOptions, keys: ['title', 'description'] }})
</script>

<template>
    <v-select
        label="Gradients"
        v-model="props.options.gradientBuilder"
        :items="gradientDrawerOptions"
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