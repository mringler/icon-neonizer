<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
</script>

<template>
    <v-text-field
        label="Clustering Cycles"
        v-model="props.options.colorquantcycles"
        type="number"
        min="1"
        required
    ></v-text-field>
</template>