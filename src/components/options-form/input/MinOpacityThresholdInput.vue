<script setup  lang="ts">
import { toRef } from 'vue';
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';
import { useInputConfig } from '@/composables/inputConfig'

const props = withDefaults(defineProps<{
    options: GradientDrawerOptions,
    showHelp: boolean,
}>(), {
    showHelp: false
})

const description = 'Remove near-invisible shapes. Shapes with opacity below the given threshold will be removed. Values are between 0 (no removals) and 1 (remove all).'
const inputConfig = useInputConfig(toRef(props, 'showHelp'), { description })
</script>

<template>
    <v-text-field
        label="Minimum Opacity Threshold"
        v-model="props.options.minOpacityThreshold"
        type="number"
        step="0.1"
        min="0"
        max="1"
        v-bind="inputConfig.attrs"
    >
        <template
            v-for="(InputSlot, slotName) in inputConfig.slots"
            :key="slotName"
            v-slot:[slotName]
        >
            <Component :is="InputSlot" />
        </template>
    </v-text-field>
</template>