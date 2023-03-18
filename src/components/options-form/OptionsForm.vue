<script setup lang="ts">

import { CreatePaletteMode, RgbColor } from '@image-tracer/core';
import { watchEffect, computed, h, DefineComponent } from 'vue'
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
import { VRow, VCol } from 'vuetify/components';


const props = defineProps<{
    options: GradientDrawerOptions,
    imageData?: ImageData | (() => Promise<ImageData>),
}>()

watchEffect(() => props.options.palette = props.options.palette?.map(RgbColor.fromRgbColorData) ?? [])

type ComponentDeclaration = { component: DefineComponent<{options: GradientDrawerOptions}, any, any, any, any>, cols?: any, props?: any }

const formRows = computed(() => {
    const rows: ({ title: string } | ComponentDeclaration[])[] = [
        { title: 'Svg Options' },
        [
            { component: ColorBuilderSelect },
            { component: ColorGradientSelect },
            { component: FullOpacityThresholdInput },
            { component: RemoveBackgroundCheckbox },
        ],
        [
            { component: FillStyleSelect },
            { component: StrokeWidthInput },
            { component: TrimSelect },
            { component: ScaleInputVue },
        ],
        { title: 'Tracer Options' },
        [
            { component: LineErrorMarginInput },
            { component: CurveErrorMarginInput },
            { component: MinimumShapeOutlineSizeInput, cols: { sm: 12 } },
        ], [
            { component: BlurRadiusInput },
            { component: BlurDeltaInput },
            { component: SharpenCheckbox },
            { component: SharpenDeltaInput },
        ],
        { title: 'Interpolation Options' },
        [
            { component: InterpolatePointsCheckbox },
            { component: EnhanceRightAnglesCheckbox },
        ],
        { title: 'Color Quantization Options' },
    ]

    if (props.options.colorsampling === CreatePaletteMode.PALETTE) {
        rows.push([
            { component: ColorSamplingModeSelect, cols: { md: 6, lg: 3 } },
            { component: ImageColorPickerVue, cols: { sm: 12, md: 6, lg: 9, xl: 9 }, props: { imageData: props.imageData } },
        ])
    } else {
        rows.push([
            { component: ColorSamplingModeSelect, cols: { md: 6, lg: 3 } },
            { component: NumberOfColorsInput },
            { component: ClusteringCyclesInput },
            { component: MinimumQuotaInput, cols: { offsetMd: 6, offsetLg: 0 } },
        ])
    }

    return rows
})


const FormRows = () => {
    const componentProps = { options: props.options }
    const cols = {
        cols: 12,
        sm: 6,
        md: 3,
        xl: 2
    }
    return formRows.value.map(row =>
        h(VRow, !Array.isArray(row) ?
            h(VCol, { class: 'text-h6' }, [row.title]) :
            row.map(col => h(VCol, col.cols ? { ...cols, ...col.cols } : cols, [
                h(col.component, col.props ? { ...col.props, ...componentProps } : componentProps)
            ]))
        )
    )
}

</script>

<template>
    <v-form>
        <v-container>
            <FormRows />
        </v-container>
    </v-form>
</template>

<style scoped></style>
