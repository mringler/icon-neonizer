<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
const description = 'Number of target colors that will be generated.'
</script>

<template>
    <v-text-field
        label="Number of Colors"
        v-model="props.options.numberofcolors"
        required
        type="number"
        min="1"
    ></v-text-field>
</template>