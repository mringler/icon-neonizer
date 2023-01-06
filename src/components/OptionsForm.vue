<script setup lang="ts">

import { CreatePaletteMode, Options, RgbColor, FillStyle, TrimMode } from '@image-tracer/core';
import { ref, Ref, computed, WritableComputedRef, watch } from 'vue'
import ImagePixelColorPickerPopup from './ImagePixelColorPickerPopup.vue';
import SelectedColorChips from './SelectedColorChips.vue';

type Props = {
    options: Options,
    imageData?: ImageData | (() => Promise<ImageData>),
}
const props = defineProps<Props>()
const emit = defineEmits(['update:options'])
const options: Ref<Options> = ref({} as Options)
const isValid = ref(true)
const colorPalette:Ref<RgbColor[]> = ref([] as RgbColor[])

watch(
    () => props.options,
    () => options.value = props.options,
    { immediate: true }
)

function usePaletteMode():boolean{
    return options.value.colorsampling === CreatePaletteMode.PALETTE
}

function emitUpdate(){
    options.value.pal = (usePaletteMode()) ? colorPalette.value : null 
    emit('update:options', options)
}

const itemsColorSampling = [
    { title: 'Use generated palette', value: CreatePaletteMode.GENERATE },
    { title: 'Sample image randomly', value: CreatePaletteMode.SAMPLE },
    { title: 'Sample image along a grid', value: CreatePaletteMode.SCAN },
    { title: 'Choose colors', value: CreatePaletteMode.PALETTE },
]

const itemsFillStyle = [
    { title: 'Fill', value: FillStyle.FILL },
    { title: 'Stroke & Fill', value: FillStyle.STROKE_FILL },
    { title: 'Stroke', value: FillStyle.STROKE },
]

const itemsTrim = [
    { title: 'Off', value: TrimMode.OFF },
    { title: 'Keep aspect ratio', value: TrimMode.KEEP_RATIO },
    { title: 'All', value: TrimMode.ALL },
]
</script>

<template>
    <v-form
        v-model="isValid"
        @update:model-value="emitUpdate"
    >
        <v-container>

            <h4>Svg Options</h4>
            <v-row>
                <v-col cols="3">
                    <v-text-field
                        label="Stroke Width"
                        v-model="options.strokewidth"
                        required
                        type="number"
                        min="1"
                    ></v-text-field>
                </v-col>

                <v-col cols="3">
                    <v-select
                        label="Fill Style"
                        v-model="options.fillstyle"
                        :items="itemsFillStyle"
                        required
                    ></v-select>
                </v-col>

                <v-col cols="6">
                    <v-select
                        label="Trim"
                        v-model="options.trim"
                        :items="itemsTrim"
                        required
                    ></v-select>
                </v-col>

            </v-row>

            <h4>Tracer Options</h4>

            <v-row>
                <v-col cols="6">
                    <v-text-field
                        label="Line Error Margin"
                        v-model="options.ltres"
                        required
                        type="number"
                        step="0.1"
                        min="0"
                    ></v-text-field>
                </v-col>

                <v-col cols="6">
                    <v-text-field
                        label="Curve Error Margin"
                        v-model="options.qtres"
                        required
                        type="number"
                        step="0.1"
                        min="0"
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="6">
                    <v-text-field
                        label="Minimum shape outline pixel size"
                        v-model="options.pathomit"
                        required
                        type="number"
                        min="0"
                    ></v-text-field>
                </v-col>

                <v-col cols="3">
                    <v-text-field
                        label="Blur Radius"
                        v-model="options.blurradius"
                        required
                        type="number"
                        step="0.1"
                        min="0"
                    ></v-text-field>
                </v-col>

                <v-col cols="3">
                    <v-text-field
                        label="Blur Delta"
                        v-model="options.blurdelta"
                        required
                        type="number"
                        step="0.1"
                        min="0"
                    ></v-text-field>
                </v-col>
            </v-row>

            <h4>Interpolation Options</h4>

            <v-row>

                <v-col cols="6">
                    <v-checkbox
                        label="Interpolation Mode"
                        v-model="options.interpolationMode"
                        false-value="off"
                        true-value="interpolate"
                    ></v-checkbox>
                </v-col>

                <v-col cols="6">

                    <v-checkbox
                        label="Enhance Right Angles"
                        :disabled="options.interpolationMode === 'off'"
                        v-model="options.rightangleenhance"
                    ></v-checkbox>
                </v-col>

            </v-row>

            <h4>Color Quantization Options</h4>


            <v-row>
                <v-col
                    cols="12"
                    md="3"
                >
                    <v-select
                        label="Sampling Mode"
                        v-model="options.colorsampling"
                        :items="itemsColorSampling"
                        required
                        @update:model-value=""
                    ></v-select>
                </v-col>

                <v-col
                    v-if="usePaletteMode()"
                    cols="12"
                    md="9"
                >

                    <SelectedColorChips
                        v-model:colors="colorPalette"
                        unique
                    >
                        <template
                            v-if="props.imageData"
                            v-slot:color-adder="{ isShow, setShow }"
                        >
                            <ImagePixelColorPickerPopup
                                :model-value="isShow"
                                @update:model-value="setShow"
                                v-model:colors="colorPalette"
                                :image-data="props.imageData!"
                                unique
                            />
                        </template>
                    </SelectedColorChips>
                </v-col>

                <template v-if="!usePaletteMode()">
                    <v-col
                        cols="4"
                        md="3"
                    >
                        <v-text-field
                            label="Number of Colors"
                            v-model="options.numberofcolors"
                            required
                            type="number"
                            min="1"
                        ></v-text-field>
                    </v-col>

                    <v-col
                        cols="4"
                        md="3"
                    >
                        <v-text-field
                            label="Clustering Cycles"
                            v-model="options.colorquantcycles"
                            type="number"
                            min="1"
                            required
                        ></v-text-field>
                    </v-col>

                    <v-col
                        cols="4"
                        md="3"
                    >
                        <v-text-field
                            label="Minimum Quota"
                            v-model="options.mincolorratio"
                            type="number"
                            min="0"
                            step="0.05"
                            max="1"
                        ></v-text-field>
                    </v-col>

                </template>
            </v-row>
        </v-container>
        <slot
            :options="options"
            :isValid="isValid"
        />
    </v-form>

</template>

<style scoped>

</style>
