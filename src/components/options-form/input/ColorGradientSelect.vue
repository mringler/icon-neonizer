<script setup  lang="ts">
import { GradientBuilderOption } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
const gradientDrawerOptions = [
    { title: 'Random', value: GradientBuilderOption.random, description: 'Pick a random direction for each color gradient.' },
    { title: 'Fixed', value: GradientBuilderOption.fixed, description: 'Use the same direction for each gradient, every element gets full range.' },
    { title: 'Flat', value: GradientBuilderOption.flat, description: 'Use the same direction for each gradient, gradient spans the image rather then element so element coloring depends on position.' },
]
</script>

<template>
    <v-select
        label="Gradients"
        v-model="props.options.gradientBuilder"
        :items="gradientDrawerOptions"
        required
    ></v-select>
</template>