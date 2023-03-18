<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
const description = 'Sharpen source image input.'
</script>

<template>
    <v-checkbox
        label="Sharpen"
        v-model="props.options.sharpen"
    ></v-checkbox>
</template>