import { RgbColor, RgbColorData } from '@image-tracer-ts/core'
import type { HSV } from 'color-functions/dist/rgb2hsv'
import { SaturatedColorPairBuilder } from './saturated-color-pair-builder'

const upperColors: RgbColorData[] = [
    { r: 25, g: 255, b: 255 }, // aqua
    { r: 255, g: 25, b: 255 }, // hotpink
    { r: 255, g: 255, b: 25 }, // lemon
    { r: 255, g: 25, b: 125 }, // guava
    { r: 25, g: 255, b: 125 }, // mint
    { r: 125, g: 25, b: 255 }, // purple
    { r: 0, g: 194, b: 255 }, // light blue
]

const lowerColors: RgbColorData[] = [
    { r: 20, g: 209, b: 209 }, // mint
    { r: 209, g: 20, b: 209 }, // pink
    { r: 209, g: 209, b: 20 }, // lemon
    { r: 209, g: 20, b: 120 }, // guava
    { r: 20, g: 209, b: 120 }, // oozing green
    { r: 120, g: 20, b: 209 }, // purple
    { r: 20, g: 120, b: 255 }, // tropical blue
    { r: 0, g: 145, b: 145 }, // dark cyan
]

export class PreSelectedColorPairBuilder extends SaturatedColorPairBuilder {
    public isTooDark(color: RgbColor): boolean {
        return color.a < 50
    }

    protected selectRandom<T = any>(arr: T[]): T {
        const ix = (arr.length * Math.random()) | 0
        return arr[ix]
    }

    protected generateWhitePair(hsvColor: HSV): [RgbColor, RgbColor] {
        const colors = [this.selectRandom(upperColors), this.selectRandom(lowerColors)] as const
        return colors.map(RgbColor.fromRgbColorData) as [RgbColor, RgbColor]
    }

    protected generateBlackPair(hsvColor: HSV, alpha: number): [RgbColor, RgbColor] {
        return this.generateWhitePair(hsvColor)
    }
}
