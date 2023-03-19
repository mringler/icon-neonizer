<script setup  lang="ts">
import { toRef } from 'vue';
import { FillStyle } from '@image-tracer/core';
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';
import { useInputConfig } from '@/composables/inputConfig'

const props = withDefaults(defineProps<{
    options: GradientDrawerOptions,
    showHelp: boolean,
}>(), {
    showHelp: false
})

const description = 'Stroke width in pixel.'
const inputConfig = useInputConfig(toRef(props, 'showHelp'), { description })
</script>

<template>
    <v-text-field
        label="Stroke Width"
        v-model="props.options.strokewidth"
        :disabled="props.options.fillstyle === FillStyle.FILL"
        required
        type="number"
        min="1"
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