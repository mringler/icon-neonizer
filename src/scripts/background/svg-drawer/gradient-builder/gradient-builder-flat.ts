import type { RgbColor, TraceData } from "@image-tracer/core";
import type { ColorPairBuilder } from "../color-pair-builder/color-pair-builder";
import { GradientBuilder, GradientPoints, GradientTags } from "./gradient-builder";

export class GradientBuilderFlat extends GradientBuilder{

    protected gradientPoints!: GradientPoints

    public init(traceData: TraceData, scale: number){
        this.gradientPoints = this.buildBoundedGradient([0, traceData.width * scale], [0, traceData.height * scale])
    }

    protected buildBoundedGradient(
        xRange: [number, number],
        yRange: [number, number],
    ): GradientPoints {
        const gradientPoints = super.selectGradientPoints()
        gradientPoints.x1 = xRange[gradientPoints.x1]
        gradientPoints.x2 = xRange[gradientPoints.x2]
        gradientPoints.y1 = yRange[gradientPoints.y1]
        gradientPoints.y2 = yRange[gradientPoints.y2]

        return gradientPoints
    }

    public generateGradient(id: string, color: RgbColor, colorPairBuilder: ColorPairBuilder): GradientTags
    {
        const [startColor, stopColor] = colorPairBuilder.generateColorPair(color);
        const {x1, x2, y1, y2} = this.gradientPoints

        return [
            `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="userSpaceOnUse">`,
            `  <stop offset="0%" stop-color="${startColor.toCssColor()}"/>`,
            `  <stop offset="100%" stop-color="${stopColor.toCssColor()}"/>`,
            `</linearGradient>`
        ];
    }
}