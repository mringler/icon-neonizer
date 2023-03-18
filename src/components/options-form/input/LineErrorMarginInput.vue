<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
const description = 'Defines how far (in pixels) a straight line element can deviate from the traced pixel line before it is broken up into multiple line elements.'
</script>

<template>
    <v-text-field
        label="Line Error Margin"
        v-model="props.options.ltres"
        required
        type="number"
        step="0.1"
        min="0"
    ></v-text-field>
</template>