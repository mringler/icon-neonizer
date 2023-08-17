import type { RgbColor, TraceData } from "@image-tracer-ts/browser"
import type { ColorPairBuilder } from "../color-pair-builder/color-pair-builder"
import type { GradientBuilder, GradientTags } from "../gradient-builder/gradient-builder"
import { type GradientDrawerOptions, GradientDrawerOptionsUtil } from "../gradient-drawer-options"
import type { ColorStringMap } from "./svg-path-editor"
import type { ColorHash } from "./color-extractor"


export type ColorData = {
    rgb: RgbColor
    hash: ColorHash
    id: string
    gradient: GradientTags
}
export type ColorStringToGradientDataMap = Map<string, ColorData>


export class ColorGradientMapBuilder {
    protected colorPairBuilder: ColorPairBuilder
    protected gradientBuilder: GradientBuilder

    public constructor(svgDom: Document, rgbColors: RgbColor[], customOptions?: Partial<GradientDrawerOptions>) {
        this.colorPairBuilder = GradientDrawerOptionsUtil.getColorPairBuilderFromOption(
            customOptions?.colorBuilder
        )
        this.gradientBuilder = GradientDrawerOptionsUtil.getGradientBuilderFromOption(
            customOptions?.gradientBuilder
        )

        const traceData = this.buildMockTraceData(svgDom, rgbColors)
        this.gradientBuilder.init(traceData, customOptions?.scale ?? 1)
        this.colorPairBuilder.init(traceData)
    }

    protected buildMockTraceData(svgDom: Document, rgbColors: RgbColor[]): TraceData {
        const bBox = svgDom.querySelector('svg')?.getBBox()

        return {
            areasByColor: [],
            colors: rgbColors,
            height: bBox?.height ?? 0,
            width: bBox?.width ?? 0,
        }
    }

    public buildColorGradients(colorStringMap: ColorStringMap): ColorStringToGradientDataMap{
        const colorDataMap = new Map<string, ColorData>()
        for (const [colorString, { rgb, hash }] of colorStringMap.entries()) {
            const [id, gradient] = this.gradientBuilder.generateGradient(rgb, this.colorPairBuilder)
            const colorData : ColorData = { rgb, hash, id, gradient }
            colorDataMap.set(colorString, colorData)
        }

        return colorDataMap
    }

    public findSingleColorReplacement(color: RgbColor){
        const index = Math.random() >= 0.5 ? 1 : 0
        return this.colorPairBuilder.generateColorPair(color)[index]
    }

}
