<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
const description = 'Remove a colored background. Must be a single element spanning the whole image.'
</script>

<template>
    <v-checkbox
        label="Remove Background"
        v-model="props.options.removeBackground"
    ></v-checkbox>
</template>