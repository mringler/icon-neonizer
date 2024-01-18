<script setup lang="ts">
import { watch, ref, type Ref } from 'vue'
import type { RgbColor } from '@image-tracer-ts/core'
import ImagePixelColorPicker from './ImagePixelColorPicker.vue'
import SelectedColorChips from './SelectedColorChips.vue'

type Props = {
    unique?: boolean
    imageData: ImageData | (() => Promise<ImageData>)
}

const colors = defineModel<RgbColor[]>('colors', { required: true, default: () => [] as RgbColor[] })
const model = defineModel<boolean>({required: true})

const props = defineProps<Props>()
const pickedColors: Ref<RgbColor[]> = ref([])

watch(
    colors,
    () => (pickedColors.value = colors.value.slice()),
    { immediate: true }
)

function emitUpdate() {
    colors.value = pickedColors.value
    model.value = false
}

function addColor(color: RgbColor) {
    if (props.unique && pickedColors.value.some((c) => c.equals(color))) {
        return
    }
    pickedColors.value.push(color)
}
</script>

<template>
    <v-dialog
        v-model="model"
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
                    @click="model = false"
                > Cancel </v-btn>
                <v-btn
                    color="primary"
                    variant="outlined"
                    @click="emitUpdate"
                > Add </v-btn>
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
