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
    'SVG coordinates are multiplied by this number and the viewport is adjusted accordingly. Particularly useful when strokes appear too thick.'
const inputConfig = useInputConfig(toRef(props, 'showHelp'), { description })
</script>

<template>
    <v-text-field
        label="Scale"
        v-model="props.options.scale"
        required
        type="number"
        step="1"
        min="0"
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
