<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
</script>

<template>
    <v-text-field
        label="Minimum Quota"
        v-model="props.options.mincolorratio"
        type="number"
        min="0"
        step="0.05"
        max="1"
    ></v-text-field>
</template>