import type { RgbColor, TraceData } from '@image-tracer-ts/core'
import type { HSV } from 'color-functions/dist/rgb2hsv'
import { ColorPairBuilder } from './color-pair-builder'
import { PreSelectedColorPairBuilder } from './pre-selected-color-pair-builder.'
import { SaturatedColorPairBuilder } from './saturated-color-pair-builder'

export class AdaptiveColorPairBuilder extends ColorPairBuilder {
    protected colorPairBuilder: ColorPairBuilder = new SaturatedColorPairBuilder()

    public init(traceData: TraceData) {
        if (this.isGrayscale(traceData)) {
            this.colorPairBuilder = new PreSelectedColorPairBuilder()
        }
    }

    public isGrayscale(traceData: TraceData) {
        let numberGreys = 0,
            numberColors = 0
        for (let i = 0; i < traceData.colors.length; i++) {
            const color = traceData.colors[i]
            if (color.a < 50 || traceData.areasByColor[i].length === 0) {
                continue
            }
            const min = Math.min(color.r, color.g, color.b)
            const max = Math.max(color.r, color.g, color.b)
            const isGrey = max - min < 40
            isGrey ? numberGreys++ : numberColors++
        }
        return numberGreys > 0 && numberColors <= 2
    }

    public isTooDark(color: RgbColor): boolean {
        return this.colorPairBuilder.isTooDark(color)
    }

    protected generateWhitePair(hsvColor: HSV): [RgbColor, RgbColor] {
        return this.colorPairBuilder['generateWhitePair'](hsvColor) // escape-hatch with dynamic property access
    }

    protected generateBlackPair(hsvColor: HSV, alpha: number): [RgbColor, RgbColor] {
        return this.colorPairBuilder['generateBlackPair'](hsvColor, alpha) // escape-hatch with dynamic property access
    }

    protected generateSaturatedPair(hsvColor: HSV): [RgbColor, RgbColor] {
        return this.colorPairBuilder['generateSaturatedPair'](hsvColor) // escape-hatch with dynamic property access
    }
}
