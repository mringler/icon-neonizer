<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
const description = 'Interpolate traced points. Gives clearer lines, but distorts small images where shifts by a half pixel are noticeable.'
</script>

<template>
    <v-checkbox
        label="Interpolate Points"
        v-model="props.options.interpolationMode"
        false-value="off"
        true-value="interpolate"
        hideDetails
    ></v-checkbox>
</template>