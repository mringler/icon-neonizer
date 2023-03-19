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

const description = 'Remove traced shapes when their outline contains less than the given number of pixels.'
const inputConfig = useInputConfig(toRef(props, 'showHelp'), { description })
</script>

<template>
    <v-text-field
        label="Minimum shape outline pixel size"
        v-model="props.options.pathomit"
        required
        type="number"
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