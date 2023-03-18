<script setup lang="ts">

import { CreatePaletteMode, RgbColor } from '@image-tracer/core';
import { watchEffect, computed } from 'vue'
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';
import ColorBuilderSelect from './input/ColorBuilderSelect.vue'
import ColorGradientSelect from './input/ColorGradientSelect.vue';
import FullOpacityThresholdInput from './input/FullOpacityThresholdInput.vue';
import RemoveBackgroundCheckbox from './input/RemoveBackgroundCheckbox.vue';
import FillStyleSelect from './input/FillStyleSelect.vue';
import ColorSamplingModeSelect from './input/ColorSamplingModeSelect.vue';
import StrokeWidthInput from './input/StrokeWidthInput.vue';
import TrimSelect from './input/TrimSelect.vue';
import ScaleInputVue from './input/ScaleInput.vue';
import LineErrorMarginInput from './input/LineErrorMarginInput.vue';
import CurveErrorMarginInput from './input/CurveErrorMarginInput.vue';
import MinimumShapeOutlineSizeInput from './input/MinimumShapeOutlineSizeInput.vue';
import BlurRadiusInput from './input/BlurRadiusInput.vue';
import BlurDeltaInput from './input/BlurDeltaInput.vue';
import SharpenCheckbox from './input/SharpenCheckbox.vue';
import SharpenDeltaInput from './input/SharpenDeltaInput.vue';
import InterpolatePointsCheckbox from './input/InterpolatePointsCheckbox.vue';
import EnhanceRightAnglesCheckbox from './input/EnhanceRightAnglesCheckbox.vue';
import ImageColorPickerVue from './input/ImageColorPicker.vue';
import NumberOfColorsInput from './input/NumberOfColorsInput.vue';
import ClusteringCyclesInput from './input/ClusteringCyclesInput.vue';
import MinimumQuotaInput from './input/MinimumQuotaInput.vue';


const props = defineProps<{
    options: GradientDrawerOptions,
    imageData?: ImageData | (() => Promise<ImageData>),
}>()

const isPaletteMode = computed(() => props.options.colorsampling === CreatePaletteMode.PALETTE)

watchEffect(() => props.options.palette = props.options.palette?.map(RgbColor.fromRgbColorData) ?? [])


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

            <v-row>
                <v-col class="text-h6">Svg Options</v-col>
            </v-row>

            <v-row>

                <v-col v-bind="cols">
                    <ColorBuilderSelect :options="props.options" />
                </v-col>

                <v-col v-bind="cols">
                    <ColorGradientSelect :options="props.options" />
                </v-col>

                <v-col v-bind="cols">
                    <FullOpacityThresholdInput :options="props.options" />
                </v-col>

                <v-col v-bind="cols">
                    <RemoveBackgroundCheckbox :options="props.options" />
                </v-col>

            </v-row>

            <v-row>

                <v-col v-bind="cols">
                    <FillStyleSelect :options="props.options" />
                </v-col>

                <v-col v-bind="cols">
                    <StrokeWidthInput :options="props.options" />
                </v-col>

                <v-col v-bind="cols">
                    <TrimSelect :options="props.options" />
                </v-col>

                <v-col v-bind="cols">
                    <ScaleInputVue :options="props.options" />
                </v-col>

            </v-row>

            <v-row>
                <v-col class="text-h6">Tracer Options</v-col>
            </v-row>

            <v-row>
                <v-col v-bind="cols">
                    <LineErrorMarginInput :options="props.options" />
                </v-col>

                <v-col v-bind="cols">
                    <CurveErrorMarginInput :options="props.options" />
                </v-col>

                <v-col
                    v-bind="cols"
                    sm="12"
                >
                    <MinimumShapeOutlineSizeInput :options="props.options" />
                </v-col>
            </v-row>

            <v-row>

                <v-col v-bind="cols">
                    <BlurRadiusInput :options="props.options" />
                </v-col>

                <v-col v-bind="cols">
                    <BlurDeltaInput :options="props.options" />
                </v-col>

                <v-col v-bind="cols">
                    <SharpenCheckbox :options="props.options" />
                </v-col>

                <v-col v-bind="cols">
                    <SharpenDeltaInput :options="props.options" />
                </v-col>

            </v-row>

            <v-row>
                <v-col class="text-h6">Interpolation Options</v-col>
            </v-row>

            <v-row>

                <v-col v-bind="cols">
                    <InterpolatePointsCheckbox :options="props.options" />
                </v-col>

                <v-col v-bind="cols">
                    <EnhanceRightAnglesCheckbox :options="props.options" />
                </v-col>

            </v-row>

            <v-row>
                <v-col class="text-h6">Color Quantization Options</v-col>
            </v-row>


            <v-row>
                <v-col
                    v-bind="cols"
                    md="6"
                    lg="3"
                >
                    <ColorSamplingModeSelect :options="props.options" />
                </v-col>

                <v-col
                    v-if="isPaletteMode"
                    cols="12"
                    md="6"
                    lg="9"
                >
                    <ImageColorPickerVue
                        :options="props.options"
                        :imageData="props.imageData"
                    />
                </v-col>

                <template v-if="!isPaletteMode">
                    <v-col v-bind="cols">
                        <NumberOfColorsInput :options="props.options" />
                    </v-col>

                    <v-col v-bind="cols">
                        <ClusteringCyclesInput :options="props.options" />
                    </v-col>

                    <v-col
                        v-bind="cols"
                        offset-md="6"
                        offset-lg="0"
                    >
                        <MinimumQuotaInput :options="props.options" />
                    </v-col>

                </template>
            </v-row>
        </v-container>
    </v-form>
</template>

<style scoped></style>
