<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
</script>

<template>
    <v-checkbox
        label="Enhance Right Angles"
        :disabled="props.options.interpolationMode === 'off'"
        v-model="props.options.rightangleenhance"
        hideDetails
    ></v-checkbox>
</template>