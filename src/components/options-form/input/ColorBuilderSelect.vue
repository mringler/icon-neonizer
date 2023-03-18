<script setup  lang="ts">
import { ColorBuilderOption } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()

const colorDrawerOptions = [
    {
        title: 'Saturate',
        value: ColorBuilderOption.saturate,  
        description: 'Use bright colors based on input color.',
        colors: 'Fully saturated color and a randomly picked neighbor.',
        whites: 'Full white (#fff) and a half-saturated random color.',
        blacks: 'Full black (#000) and a slightly colored black tone.'
    },
    {
        title: 'Neon',
        value: ColorBuilderOption.neon,
        description: 'Replace colors with pre-defined neon color.',
        colors: 'Closest neon color and a slightly brighter neighbor.',
        whites: 'None/transparent',
        blacks: 'None/transparent.'
    },
    {
        title: 'Lighten',
        value: ColorBuilderOption.lighten,
        description: 'Brighten up input color and blend to a lighter shade.',
        colors: 'Fully saturate color and a lighter shade of the color.',
        whites: 'Full white (#fff) and a half-saturated random color.',
        blacks: 'Full black (#000) and a slightly colored black tone.'
    
    },
    {
        title: 'Darken',
        value: ColorBuilderOption.darken,
        description: 'Brighten up input color and blend to a darker shade.',
        colors: 'Fully saturate color and a darker shade of the color.',
        whites: 'Full white (#fff) and a half-saturated random color.',
        blacks: 'Full black (#000) and a slightly colored black tone.'
    },
    {
        title: 'Whiteout',
        value: ColorBuilderOption.whiteout,
        description: 'Replace whites and blacks with randomly chosen bright colors.',
        colors: 'Fully saturated color and a randomly picked neighbor.',
        whites: 'Two randomly chosen bright colors.',
        blacks: 'Two randomly chosen bright colors.'
    },
    {
        title: 'Adaptive',
        value: ColorBuilderOption.adaptive,
        description: 'Choose color pair build by analyzing image.',
        colors: 'Depends on input.',
        whites: 'Depends on input.',
        blacks: 'Depends on input.'
    },
]

const description = `
Select color transformation mode.

Defines how the gradient's two colors are chosen from the initial color in the image. Modes distinguish between actual colors, whites and blacks, and use different mechanisms for each.

<ul>
  <li><code></code></li>
</ul>
`
</script>

<template>
    <v-select
        label="Colors"
        v-model="props.options.colorBuilder"
        :items="colorDrawerOptions"
        required
    ></v-select>
</template>