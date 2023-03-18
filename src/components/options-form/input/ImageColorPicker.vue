<script setup  lang="ts">
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';
import type { RgbColor } from '@image-tracer/core';
import SelectedColorChips from '../color-picker/SelectedColorChips.vue';
import ImagePixelColorPickerPopup from '../color-picker/ImagePixelColorPickerPopup.vue';

const props = defineProps<{
    options: GradientDrawerOptions,
    imageData?: ImageData | (() => Promise<ImageData>),
}>()
const description = 'Pick target colors from the source image.'

function autoOpenColorPicker(): boolean {
    return !Boolean(props.options.palette?.length)
}
</script>

<template>
    <SelectedColorChips
        :showPicker="autoOpenColorPicker()"
        v-model:colors="options.palette as RgbColor[]"
        unique
    >
        <template
            v-if="props.imageData"
            v-slot:color-adder="{ isShow, setShow }"
        >
            <ImagePixelColorPickerPopup
                :model-value="isShow"
                @update:model-value="setShow"
                v-model:colors="(options.palette as RgbColor[])"
                :image-data="props.imageData!"
                unique
            />
        </template>
    </SelectedColorChips>
</template>