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

const description = 'Preserves right angles during interpolation'
const inputConfig = useInputConfig(toRef(props, 'showHelp'), { description })

</script>

<template>
    <v-checkbox
        label="Enhance Right Angles"
        :disabled="props.options.interpolation === 'off'"
        v-model="props.options.enhanceRightAngles"
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