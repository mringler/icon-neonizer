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

const description = 'Defines how far (in pixels) a curved line element can deviate from the traced pixel line before it is broken up into multiple line elements.'
const inputConfig = useInputConfig(toRef(props, 'showHelp'), { description })
</script>

<template>
    <v-text-field
        label="Curve Error Margin"
        v-model="props.options.qtres"
        required
        type="number"
        step="0.1"
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