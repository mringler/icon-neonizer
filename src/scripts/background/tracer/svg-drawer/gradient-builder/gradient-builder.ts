import type { RgbColor, TraceData } from '@image-tracer-ts/core'
import type { ColorPairBuilder } from '../color-pair-builder/color-pair-builder'

export type GradientPoints = { x1: number; x2: number; y1: number; y2: number }
export type GradientTags = string[]

export class GradientBuilder {
    public init(traceData: TraceData, scale: number) {}

    protected selectGradientPoints(): GradientPoints {
        const x1 = Math.round(Math.random())
        const y1 = Math.round(Math.random())
        const x2 = Math.round(Math.random())
        const y2 = x1 === x2 ? 1 - y1 : Math.round(Math.random())
        return { x1, y1, x2, y2 }
    }

    public generateGradient(
        color: RgbColor,
        colorPairBuilder: ColorPairBuilder
    ): [string, GradientTags] {
        const id = this.generateGradientId(color)
        const [startColor, stopColor] = colorPairBuilder.generateColorPair(color)
        const { x1, x2, y1, y2 } = this.selectGradientPoints()

        return [
            id,
            [
                `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">`,
                `  <stop offset="0%" stop-color="${startColor.toCssColor()}"/>`,
                `  <stop offset="100%" stop-color="${stopColor.toCssColor()}"/>`,
                '</linearGradient>',
            ],
        ]
    }

    public generateGradientId(color: RgbColor): string {
        const colorId = color.toCssColorHex().substring(1)
        const randomChars = (Math.random() + 1).toString(36).substring(8)
        return `${randomChars}_${colorId}`
    }
}
