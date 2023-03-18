<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
</script>

<template>
    <v-text-field
        label="Blur Radius"
        v-model="props.options.blurradius"
        required
        type="number"
        step="1"
        min="0"
        max="5"
    ></v-text-field>
</template>