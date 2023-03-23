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
    'Interpolate traced points. Gives clearer lines, but distorts small images where shifts by a half pixel are noticeable.'
const inputConfig = useInputConfig(toRef(props, 'showHelp'), { description })
</script>

<template>
    <v-checkbox
        label="Interpolate Points"
        v-model="props.options.interpolation"
        false-value="off"
        true-value="interpolate"
        hideDetails
        v-bind="inputConfig.attrs"
    >
        <template
            v-for="(InputSlot, slotName) in inputConfig.slots"
            :key="slotName"
            v-slot:[slotName]
        >
            <Component :is="InputSlot" />
        </template>
    </v-checkbox>
</template>
