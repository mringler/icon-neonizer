<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
</script>

<template>
    <v-text-field
        label="Blur Delta"
        v-model="props.options.blurdelta"
        type="number"
        step="10"
        min="0"
    ></v-text-field>
</template>