<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
</script>

<template>
    <v-text-field
        label="Curve Error Margin"
        v-model="props.options.qtres"
        required
        type="number"
        step="0.1"
        min="0"
    ></v-text-field>
</template>