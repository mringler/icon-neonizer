<script setup lang="ts">
import { toRef } from 'vue'
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options'
import { useInputConfig } from '@/composables/inputConfig'

const props = withDefaults(
    defineProps<{
        options: GradientDrawerOptions
        showHelp: boolean
    }>(),
    {
        showHelp: false,
    }
)

const description =
    'During each cycle, the target colors are adjusted to better match the colors in the image.'
const inputConfig = useInputConfig(toRef(props, 'showHelp'), { description })
</script>

<template>
    <v-text-field
        label="Clustering Cycles"
        v-model="props.options.colorClusteringCycles"
        type="number"
        min="1"
        required
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
