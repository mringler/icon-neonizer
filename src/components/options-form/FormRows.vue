<script setup lang="ts">
import { CreatePaletteMode } from '@image-tracer-ts/core'
import { computed, h, type DefineComponent, type ComputedRef } from 'vue'
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options'

import ColorBuilderSelect from './input/ColorBuilderSelect.vue'
import ColorGradientSelect from './input/ColorGradientSelect.vue'
import FullOpacityThresholdInput from './input/FullOpacityThresholdInput.vue'
import RemoveBackgroundCheckbox from './input/RemoveBackgroundCheckbox.vue'
import FillStyleSelect from './input/FillStyleSelect.vue'
import ColorSamplingModeSelect from './input/ColorSamplingModeSelect.vue'
import StrokeWidthInput from './input/StrokeWidthInput.vue'
import TrimSelect from './input/TrimSelect.vue'
import ScaleInputVue from './input/ScaleInput.vue'
import LineErrorMarginInput from './input/LineErrorMarginInput.vue'
import CurveErrorMarginInput from './input/CurveErrorMarginInput.vue'
import MinimumShapeOutlineSizeInput from './input/MinimumShapeOutlineSizeInput.vue'
import BlurRadiusInput from './input/BlurRadiusInput.vue'
import BlurDeltaInput from './input/BlurDeltaInput.vue'
import SharpenCheckbox from './input/SharpenCheckbox.vue'
import SharpenDeltaInput from './input/SharpenDeltaInput.vue'
import InterpolatePointsCheckbox from './input/InterpolatePointsCheckbox.vue'
import EnhanceRightAnglesCheckbox from './input/EnhanceRightAnglesCheckbox.vue'
import ImageColorPicker from './input/ImageColorPicker.vue'
import NumberOfColorsInput from './input/NumberOfColorsInput.vue'
import ClusteringCyclesInput from './input/ClusteringCyclesInput.vue'
import MinimumQuotaInput from './input/MinimumQuotaInput.vue'
import { VRow, VCol } from 'vuetify/components/VGrid'
import MinOpacityThresholdInput from './input/MinOpacityThresholdInput.vue'

const props = defineProps<{
    options: GradientDrawerOptions
    imageData?: ImageData | (() => Promise<ImageData>)
    showOnlyFavorites: boolean
    showHelp: boolean
    isSvg: boolean
}>()

type Section = {
    title: string,
    rows: ComponentDeclaration[][]
}

type ComponentDeclaration = {
    component: DefineComponent<{ options: GradientDrawerOptions, showHelp: boolean }, any, any, any, any>,
    cols?: any
    props?: any
    favorite?: boolean
    inSvgMode?: boolean
}

type Row = { title: string } | ComponentDeclaration[]

const fixedRows: Section[] = [
    {
        title: 'Svg Options',
        rows: [
            [
                { component: ColorBuilderSelect, favorite: true, inSvgMode: true },
                { component: ColorGradientSelect, favorite: true, inSvgMode: true },
                { component: MinOpacityThresholdInput, favorite: true },
                { component: FullOpacityThresholdInput, inSvgMode: true },
            ],
            [
                { component: FillStyleSelect, favorite: true, inSvgMode: true },
                { component: StrokeWidthInput, favorite: true, inSvgMode: true },
                { component: TrimSelect },
                { component: ScaleInputVue },
            ],
            [{ component: RemoveBackgroundCheckbox, favorite: true }],
        ],
    },
    {
        title: 'Tracer Options',
        rows: [
            [
                { component: LineErrorMarginInput },
                { component: CurveErrorMarginInput },
                { component: MinimumShapeOutlineSizeInput, cols: { sm: 12 }, favorite: true },
            ],
            [
                { component: BlurRadiusInput },
                { component: BlurDeltaInput },
                { component: SharpenCheckbox },
                { component: SharpenDeltaInput },
            ],
        ]
    },
    {
        title: 'Interpolation Options',
        rows: [
            [
                { component: InterpolatePointsCheckbox, favorite: true },
                { component: EnhanceRightAnglesCheckbox },
            ],
        ]
    }
]

const sections: ComputedRef<Section[]> = computed(() => {
    const colorOptions: Section = {
        title: 'Color Quantization Options',
        rows: []
    }

    if (props.showOnlyFavorites) {
        colorOptions.rows.push([
            { component: ImageColorPicker, cols: { sm: 12, md: 6, lg: 9, xl: 9 }, props: { imageData: props.imageData, noAutoOpen: true }, favorite: true }
        ])
    } else if (props.options.colorSamplingMode === CreatePaletteMode.PALETTE && props.imageData) {
        colorOptions.rows.push([
            { component: ColorSamplingModeSelect, cols: { md: 6, lg: 3 } },
            { component: ImageColorPicker, cols: { sm: 12, md: 6, lg: 9, xl: 9 }, props: { imageData: props.imageData }, },
        ])
    } else {
        colorOptions.rows.push([
            { component: ColorSamplingModeSelect, cols: { md: 6, lg: 3 } },
            { component: NumberOfColorsInput },
            { component: ClusteringCyclesInput },
            { component: MinimumQuotaInput, cols: { offsetMd: 6, offsetLg: 0 } },
        ])
    }

    return [...fixedRows, colorOptions]
})

const formRows: ComputedRef<Row[]> = computed(() => {
    const rows: Row[] = []
    for (const section of sections.value) {
        const needsFilter = (!props.isSvg && !props.showOnlyFavorites)
        const sectionRows = needsFilter ? section.rows : section.rows.map(row => row.filter(comp => {
            return (!props.isSvg || comp.inSvgMode) && (!props.showOnlyFavorites || comp.favorite)
        })).filter(row => row.length > 0)
        if (sectionRows.length === 0) {
            continue
        }
        !props.showOnlyFavorites && rows.push({ title: section.title })
        rows.push(...sectionRows)
    }
    if (!props.showOnlyFavorites) {
        return rows
    }
    const favorites = rows.flat()
    const favoriteRows = Array.from({ length: Math.ceil(favorites.length / 4) }, (_, i) => favorites.slice(i * 4, i * 4 + 4)) as Row[]

    return favoriteRows
})

const cols = {
    cols: 12,
    sm: 6,
    md: 3,
    xl: 3,
}

const FormRows = () => {
    const componentProps = { options: props.options, showHelp: props.showHelp }

    return formRows.value.map((row) =>
        h(
            VRow,
            !Array.isArray(row)
                ? h(VCol, { class: 'text-h6' }, [row.title])
                : row.map((col) =>
                    h(VCol, col.cols ? { ...cols, ...col.cols } : cols, [
                        h(
                            col.component,
                            col.props ? { ...col.props, ...componentProps } : componentProps
                        ),
                    ])
                )
        )
    )
}
</script>
<template>
    <FormRows />
</template>
