<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
</script>

<template>
    <v-text-field
        :disabled="!Boolean(props.options.sharpen)"
        v-model="props.options.sharpenThreshold"
        label="Sharpen Delta"
        v-bind="$attrs"
        type="number"
        step="10"
        min="0"
    ></v-text-field>
</template>