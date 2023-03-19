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

const description = 'Maximum allowed change to pixel value through sharpen. Must be between 0 (no change) and 1020 (255 for each channel, any change is fine).'
const inputConfig = useInputConfig(toRef(props, 'showHelp'), { description })
</script>

<template>
    <v-text-field
        :disabled="!Boolean(props.options.sharpen)"
        v-model="props.options.sharpenThreshold"
        label="Sharpen Delta"
        type="number"
        step="10"
        min="0"
        max="1020"
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