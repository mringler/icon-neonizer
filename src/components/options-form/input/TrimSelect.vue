<script setup  lang="ts">
import { toRef } from 'vue';
import { TrimMode } from '@image-tracer/core';
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';
import { useInputConfig } from '@/composables/inputConfig'

const props = withDefaults(defineProps<{
    options: GradientDrawerOptions,
    showHelp: boolean,
}>(), {
    showHelp: false
})

const description = 'Remove empty space around image content.'
const itemsTrim = [
    { title: 'Off', value: TrimMode.OFF, description: 'No change to image.' },
    { title: 'Keep aspect ratio', value: TrimMode.KEEP_RATIO, description: 'Remove empty space while preserving aspect ratio.' },
    { title: 'All', value: TrimMode.ALL, description: 'Remove all empty space.' },
]
const inputConfig = useInputConfig(toRef(props, 'showHelp'), { description, tableData: { data: itemsTrim, keys: ['title', 'description'] }})
</script>

<template>
    <v-select
        label="Trim"
        v-model="props.options.trim"
        :items="itemsTrim"
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
    </v-select>
</template>