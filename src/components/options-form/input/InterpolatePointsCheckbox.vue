<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
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