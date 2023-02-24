<script setup lang="ts">

import { CreatePaletteMode, RgbColor, FillStyle, TrimMode } from '@image-tracer/core';
import { watch, ref } from 'vue'
import { ColorBuilderOption, GradientDrawerOptions, GradientBuilderOption } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';
import ImagePixelColorPickerPopup from './ImagePixelColorPickerPopup.vue';
import SelectedColorChips from './SelectedColorChips.vue';

type Props = {
    options: GradientDrawerOptions,
    imageData?: ImageData | (() => Promise<ImageData>),
}
const props = defineProps<Props>()

function autoOpenColorPicker(): boolean {
    return !Boolean(props.options.palette?.length)
}

function usePaletteMode(): boolean {
    return props.options.colorsampling === CreatePaletteMode.PALETTE
}

watch(
    () => props.options,
    () => props.options.palette = (props.options.palette) ? props.options.palette.map(RgbColor.fromRgbColorData) : [],
    { immediate: true }
)

const itemsColorSampling = [
    { title: 'Use generated palette', value: CreatePaletteMode.GENERATE },
    { title: 'Sample image randomly', value: CreatePaletteMode.SAMPLE },
    { title: 'Sample image along grid', value: CreatePaletteMode.SCAN },
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

const colorDrawerOptions = [
    { title: 'Saturate', value: ColorBuilderOption.saturate },
    { title: 'Neon', value: ColorBuilderOption.neon },
    { title: 'Lighten', value: ColorBuilderOption.lighten },
    { title: 'Darken', value: ColorBuilderOption.darken },
]

const gradientDrawerOptions = [
    { title: 'Radom', value: GradientBuilderOption.random },
    { title: 'Fixed', value: GradientBuilderOption.fixed },
    { title: 'Flat', value: GradientBuilderOption.flat },
]

const cols = {
    cols: 12,
    sm: 6,
    md: 3,
    xl: 2
}
</script>

<template>
    <v-form>

        <v-container>

            <h4>Svg Options</h4>
            <v-row>

                <v-col v-bind="cols">
                    <v-select
                        label="Fill Style"
                        v-model="props.options.fillstyle"
                        :items="itemsFillStyle"
                        required
                    ></v-select>
                </v-col>

                <v-col v-bind="cols">
                    <v-text-field
                        label="Stroke Width"
                        v-model="props.options.strokewidth"
                        required
                        type="number"
                        min="1"
                        :disabled="props.options.fillstyle === FillStyle.FILL"
                    ></v-text-field>
                </v-col>

                <v-col v-bind="cols">
                    <v-select
                        label="Trim"
                        v-model="props.options.trim"
                        :items="itemsTrim"
                        required
                    ></v-select>
                </v-col>

                <v-col v-bind="cols">
                    <v-text-field
                        label="Scale"
                        v-model="props.options.scale"
                        required
                        type="number"
                        step="1"
                        min="0"
                    ></v-text-field>
                </v-col>

            </v-row>

            <v-row>

                <v-col v-bind="cols">
                    <v-select
                        label="Colors"
                        v-model="props.options.colorBuilder"
                        :items="colorDrawerOptions"
                        required
                    ></v-select>
                </v-col>


                <v-col v-bind="cols">
                    <v-select
                        label="Gradients"
                        v-model="props.options.gradientBuilder"
                        :items="gradientDrawerOptions"
                        required
                    ></v-select>
                </v-col>

            </v-row>

            <h4>Tracer Options</h4>

            <v-row>
                <v-col v-bind="cols">
                    <v-text-field
                        label="Line Error Margin"
                        v-model="props.options.ltres"
                        required
                        type="number"
                        step="0.1"
                        min="0"
                    ></v-text-field>
                </v-col>

                <v-col v-bind="cols">
                    <v-text-field
                        label="Curve Error Margin"
                        v-model="props.options.qtres"
                        required
                        type="number"
                        step="0.1"
                        min="0"
                    ></v-text-field>
                </v-col>

                <v-col
                    v-bind="cols"
                    sm="12"
                >
                    <v-text-field
                        label="Minimum shape outline pixel size"
                        v-model="props.options.pathomit"
                        required
                        type="number"
                        min="0"
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row>

                <v-col v-bind="cols">
                    <v-text-field
                        label="Blur Radius"
                        v-model="props.options.blurradius"
                        required
                        type="number"
                        step="1"
                        min="0"
                        max="5"
                    ></v-text-field>
                </v-col>

                <v-col v-bind="cols">
                    <v-text-field
                        label="Blur Delta"
                        v-model="props.options.blurdelta"
                        type="number"
                        step="10"
                        min="0"
                    ></v-text-field>
                </v-col>

                <v-col v-bind="cols">
                    <v-checkbox
                        label="Sharpen"
                        v-model="props.options.sharpen"
                    ></v-checkbox>
                </v-col>

                <v-col v-bind="cols">
                    <v-text-field
                        label="Sharpen Delta"
                        :disabled="!Boolean(props.options.sharpen)"
                        v-model="props.options.sharpenThreshold"
                        type="number"
                        step="10"
                        min="0"
                    ></v-text-field>
                </v-col>

            </v-row>

            <h4>Interpolation Options</h4>

            <v-row>

                <v-col v-bind="cols">
                    <v-checkbox
                        label="Interpolate Points"
                        v-model="props.options.interpolationMode"
                        false-value="off"
                        true-value="interpolate"
                    ></v-checkbox>
                </v-col>

                <v-col v-bind="cols">

                    <v-checkbox
                        label="Enhance Right Angles"
                        :disabled="props.options.interpolationMode === 'off'"
                        v-model="props.options.rightangleenhance"
                    ></v-checkbox>
                </v-col>

            </v-row>

            <h4>Color Quantization Options</h4>


            <v-row>
                <v-col
                    v-bind="cols"
                    md="6"
                    lg="3"
                >
                    <v-select
                        label="Sampling Mode"
                        v-model="props.options.colorsampling"
                        :items="itemsColorSampling"
                        required
                    ></v-select>
                </v-col>

                <v-col
                    v-if="usePaletteMode()"
                    cols="12"
                    md="6"
                    lg="9"
                >

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
                </v-col>

                <template v-if="!usePaletteMode()">
                    <v-col v-bind="cols">
                        <v-text-field
                            label="Number of Colors"
                            v-model="props.options.numberofcolors"
                            required
                            type="number"
                            min="1"
                        ></v-text-field>
                    </v-col>

                    <v-col v-bind="cols">
                        <v-text-field
                            label="Clustering Cycles"
                            v-model="props.options.colorquantcycles"
                            type="number"
                            min="1"
                            required
                        ></v-text-field>
                    </v-col>

                    <v-col
                        v-bind="cols"
                        offset-md="6"
                        offset-lg="0"
                    >
                        <v-text-field
                            label="Minimum Quota"
                            v-model="props.options.mincolorratio"
                            type="number"
                            min="0"
                            step="0.05"
                            max="1"
                        ></v-text-field>
                    </v-col>

                </template>
            </v-row>
        </v-container>
    </v-form>

</template>

<style scoped>
</style>
