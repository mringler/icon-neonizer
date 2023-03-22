<script setup lang="ts">
import { CreatePaletteMode, } from '@image-tracer/core';
import { computed, h, DefineComponent } from 'vue'
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
import ImageColorPicker from './input/ImageColorPicker.vue';
import NumberOfColorsInput from './input/NumberOfColorsInput.vue';
import ClusteringCyclesInput from './input/ClusteringCyclesInput.vue';
import MinimumQuotaInput from './input/MinimumQuotaInput.vue';
import { VRow, VCol } from 'vuetify/components';
import MinOpacityThresholdInput from './input/MinOpacityThresholdInput.vue';

const props = defineProps<{
    options: GradientDrawerOptions,
    imageData?: ImageData | (() => Promise<ImageData>),
    showOnlyFavorites: boolean,
    showHelp: boolean
}>()

type ComponentDeclaration = {
    component: DefineComponent<{ options: GradientDrawerOptions, showHelp: boolean }, any, any, any, any>,
    cols?: any,
    props?: any,
    favorite?: boolean
}

type Row = ({ title: string } | ComponentDeclaration[])

const fixedRows: Row[] = [
    { title: 'Svg Options' },
    [
        { component: ColorBuilderSelect, favorite: true },
        { component: ColorGradientSelect, favorite: true },
        { component: MinOpacityThresholdInput, favorite: true },
        { component: FullOpacityThresholdInput },
    ],
    [
        { component: FillStyleSelect, favorite: true },
        { component: StrokeWidthInput, favorite: true },
        { component: TrimSelect },
        { component: ScaleInputVue },
    ],
    [
        { component: RemoveBackgroundCheckbox, favorite: true },
    ],
    { title: 'Tracer Options' },
    [
        { component: LineErrorMarginInput },
        { component: CurveErrorMarginInput },
        { component: MinimumShapeOutlineSizeInput, cols: { sm: 12 }, favorite: true },
    ], [
        { component: BlurRadiusInput },
        { component: BlurDeltaInput },
        { component: SharpenCheckbox },
        { component: SharpenDeltaInput },
    ],
    { title: 'Interpolation Options' },
    [
        { component: InterpolatePointsCheckbox, favorite: true },
        { component: EnhanceRightAnglesCheckbox },
    ],
    { title: 'Color Quantization Options' },
]

const formRows = computed(() => {

    const rows: Row[] = [...fixedRows]
    if (props.options.colorSamplingMode === CreatePaletteMode.PALETTE && props.imageData) {
        rows.push([
            { component: ColorSamplingModeSelect, cols: { md: 6, lg: 3 } },
            { component: ImageColorPicker, cols: { sm: 12, md: 6, lg: 9, xl: 9 }, props: { imageData: props.imageData } },
        ])
    } else {
        rows.push([
            { component: ColorSamplingModeSelect, cols: { md: 6, lg: 3 } },
            { component: NumberOfColorsInput },
            { component: ClusteringCyclesInput },
            { component: MinimumQuotaInput, cols: { offsetMd: 6, offsetLg: 0 } },
        ])
    }

    if (!props.showOnlyFavorites) {
        return rows
    }

    const favorites = rows.flatMap(row => !Array.isArray(row) ? [] : row.filter(col => col.favorite))
    const favoriteRows = Array.from({ length: Math.ceil(favorites.length / 4) }, (_, i) => favorites.slice(i * 4, i * 4 + 4))
    favoriteRows.push([
        { component: ImageColorPicker, cols: { sm: 12, md: 6, lg: 9, xl: 9 }, props: { imageData: props.imageData, noAutoOpen: true } }
    ])
    return favoriteRows
})

const cols = {
    cols: 12,
    sm: 6,
    md: 3,
    xl: 3
}

const FormRows = () => {
    const componentProps = { options: props.options, showHelp: props.showHelp }

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
    <FormRows />
</template>