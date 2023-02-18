<script setup lang="ts">

import { watch, ref, Ref } from 'vue';
import type { RgbColor } from '@image-tracer/core';
import ImagePixelColorPicker from './ImagePixelColorPicker.vue';
import SelectedColorChips from './SelectedColorChips.vue';

type Props = {
    modelValue: boolean,
    colors: RgbColor[],
    unique?: boolean,
    imageData: ImageData | (() => Promise<ImageData>),
}

const props = withDefaults(defineProps<Props>(), {
    colors: () => [] as RgbColor[],
});
const pickedColors: Ref<RgbColor[]> = ref([])

watch(
    () => props.colors,
    () => pickedColors.value = props.colors.slice(),
    { immediate: true }
)

const emit = defineEmits(['update:colors', 'update:modelValue'])

function emitIsOpen(value: boolean) {
    emit('update:modelValue', value)
}

function emitUpdate() {
    emit('update:colors', pickedColors.value)
    emitIsOpen(false)
}

function addColor(color: RgbColor) {
    if (props.unique && pickedColors.value.some(c => c.equals(color))) {
        return
    }
    pickedColors.value.push(color)
}

</script>

<template>
    <v-dialog
        :model-value="props.modelValue"
        @update:model-value="emitIsOpen"
        content-class="align-center"
    >
        <v-card max-width="fit-content">
            <v-card-title>
                <span class="text-h5">Pick Image Colors</span>
            </v-card-title>
            <v-card-text class="d-flex">
                <div class="picker-canvas-container">
                    <ImagePixelColorPicker
                        :imageData="props.imageData"
                        class="icon-frame"
                        @picked-color="addColor"
                    />
                </div>
                <SelectedColorChips
                    v-model:colors="pickedColors"
                    class="selectedColorsPanel"
                    unique
                    noAdd
                />
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="secondary"
                    variant="text"
                    @click="emitIsOpen(false)"
                >
                    Cancel
                </v-btn>
                <v-btn
                    color="primary"
                    variant="outlined"
                    @click="emitUpdate"
                >
                    Add
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<style scoped>
.picker-canvas-container {
    min-width: 256px;
    max-width: 512px;
    height: auto;
}

.selectedColorsPanel {
    min-width: 330px;
    max-width: 330px;
    width: 330px;
}
</style>
