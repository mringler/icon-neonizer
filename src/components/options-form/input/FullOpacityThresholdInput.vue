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
    'Further brighten colors by removing transparency. If opacity of a color is above the given threshold, it will be changed to full opacity. Values are between 0 (all colors become fully opaque) and 1 (no change).'
const inputConfig = useInputConfig(toRef(props, 'showHelp'), { description })
</script>

<template>
    <v-text-field
        label="Full Opacity Threshold"
        v-model="props.options.fullOpacityThreshold"
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
