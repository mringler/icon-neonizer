<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';
import { FillStyle } from '@image-tracer/core';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
const description = 'Stroke width in pixel.'
</script>

<template>
    <v-text-field
        label="Stroke Width"
        v-model="props.options.strokewidth"
        :disabled="props.options.fillstyle === FillStyle.FILL"
        required
        type="number"
        min="1"
    ></v-text-field>
</template>