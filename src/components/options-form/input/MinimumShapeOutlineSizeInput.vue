<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';

const props = defineProps<{
    options: GradientDrawerOptions,
}>()
const description = 'Remove traced shapes when their outline contains less than the given number of pixels.'
</script>

<template>
    <v-text-field
        label="Minimum shape outline pixel size"
        v-model="props.options.pathomit"
        required
        type="number"
        min="0"
    ></v-text-field>
</template>