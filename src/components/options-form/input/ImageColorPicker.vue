<script setup lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options'
import { CreatePaletteMode, RgbColor } from '@image-tracer/core'
import SelectedColorChips from '../color-picker/SelectedColorChips.vue'
import ImagePixelColorPickerPopup from '../color-picker/ImagePixelColorPickerPopup.vue'

const props = withDefaults(
    defineProps<{
        options: GradientDrawerOptions
        showHelp: boolean
        imageData?: ImageData | (() => Promise<ImageData>)
        noAutoOpen?: boolean
    }>(),
    {
        showHelp: false,
    }
)

//const description = 'Pick target colors from the source image.'

function autoOpenColorPicker(): boolean {
    return !props.noAutoOpen && !props.options.palette?.length
}

function updateColorMode(colors: RgbColor[]) {
    if (colors.length > 0) {
        props.options.colorSamplingMode = CreatePaletteMode.PALETTE
    } else if (props.noAutoOpen) {
        props.options.colorSamplingMode = CreatePaletteMode.SCAN
    }
    props.options.palette = colors
}
</script>

<template>
    <SelectedColorChips
        :showPicker="autoOpenColorPicker()"
        @update:colors="updateColorMode"
        :colors="options.palette as RgbColor[]"
        unique
    >
        <template
            v-if="props.imageData"
            v-slot:color-adder="{ isShow, setShow, colors, updateColors, unique }"
        >
            <ImagePixelColorPickerPopup
                :model-value="isShow"
                @update:model-value="setShow"
                :colors="colors"
                @update:colors="updateColors"
                :image-data="props.imageData!"
                :unique="unique ?? false"
            />
        </template>
    </SelectedColorChips>
</template>
