<script setup lang="ts">
import { RgbColor } from '@image-tracer/core'
import { ref, watchEffect, toRaw } from 'vue'
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options'

import { IconStorage } from '@/scripts/background/storage/icon-storage'
import { useConfirmationDialog } from '@/composables/confirmDialog'
import FormRows from './FormRows.vue'

const props = defineProps<{
    options: GradientDrawerOptions
    imageData?: ImageData | (() => Promise<ImageData>)
}>()

const showHelp = ref(false)
const showOnlyFavorites = ref(true)

watchEffect(
    () => (props.options.palette = props.options.palette?.map(RgbColor.fromRgbColorData) ?? [])
)

const showConfirm = useConfirmationDialog()

async function storeOptions() {
    showConfirm({
        title: 'Update default options',
        message: 'This will override current default settings. Continue?',
        confirmText: 'Override',
        onConfirm: () => IconStorage.storeOptions(toRaw(props.options)),
    })
}
</script>

<template>
    <v-card
        flat
        max-width="1200"
    >
        <v-toolbar density="compact">
            <v-toolbar-title>Trace Options</v-toolbar-title>

            <v-spacer></v-spacer>

            <slot name="toolbar-center" />
            <v-spacer></v-spacer>

            <v-tooltip
                :text="(showHelp ? 'Hide' : 'Show') + ' help'"
                location="top"
            >
                <template v-slot:activator="{ props }">
                    <v-btn
                        v-bind="props"
                        icon="mdi-help-circle-outline"
                        :color="showHelp ? 'primary' : undefined"
                        @click="showHelp = !showHelp"
                    />
                </template>
            </v-tooltip>
            <v-tooltip
                text="Use current settings as default"
                location="top"
            >
                <template v-slot:activator="{ props }">
                    <v-btn
                        v-bind="props"
                        icon="mdi-star"
                        @click="storeOptions"
                    />
                </template>
            </v-tooltip>

            <v-tooltip
                :text="showOnlyFavorites ? 'Show all inputs' : 'Hide auxiliary inputs'"
                location="top"
            >
                <template v-slot:activator="{ props }">
                    <v-btn
                        v-bind="props"
                        :icon="showOnlyFavorites ? 'mdi-chevron-down' : 'mdi-chevron-up'"
                        @click="showOnlyFavorites = !showOnlyFavorites"
                    />
                </template>
            </v-tooltip>
        </v-toolbar>

        <v-form>
            <v-container>
                <FormRows
                    :options="options"
                    :imageData="imageData"
                    :showHelp="showHelp"
                    :showOnlyFavorites="showOnlyFavorites"
                />
            </v-container>
        </v-form>
    </v-card>
</template>

<style scoped></style>
