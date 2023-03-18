<script setup  lang="ts">
import { TrimMode } from '@image-tracer/core';
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
const description = 'Remove empty space around image content.'
const itemsTrim = [
    { title: 'Off', value: TrimMode.OFF, description: 'No change to image.' },
    { title: 'Keep aspect ratio', value: TrimMode.KEEP_RATIO, description: 'Remove empty space while preserving aspect ' },
    { title: 'All', value: TrimMode.ALL, description: 'Remove all empty space.' },
]
</script>

<template>
    <v-select
        label="Trim"
        v-model="props.options.trim"
        :items="itemsTrim"
        required
    ></v-select>
</template>