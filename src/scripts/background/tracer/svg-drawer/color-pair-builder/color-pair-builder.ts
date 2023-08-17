import { RgbColor, RgbColorData, TraceData } from '@image-tracer-ts/core'
import rgb2hsv, { type HSV } from 'color-functions/dist/rgb2hsv'
import hsv2rgb from 'color-functions/dist/hsv2rgb'

export abstract class ColorPairBuilder {
    protected abstract generateWhitePair(hsvColor: HSV): [RgbColor, RgbColor]
    protected abstract generateBlackPair(hsvColor: HSV, alpha: number): [RgbColor, RgbColor]
    protected abstract generateSaturatedPair(hsvColor: HSV): [RgbColor, RgbColor]

    public init(traceData: TraceData) {}

    public isTooDark(color: RgbColor): boolean {
        return color.a < 100 || Math.max(color.r, color.g, color.b) < 20
    }

    protected hsvToRgb(hsv: HSV, alpha = 255): RgbColor {
        const rgb = hsv2rgb(hsv.h, hsv.s, hsv.v) as RgbColorData
        rgb.a = alpha
        return RgbColor.fromRgbColorData(rgb)
    }

    public generateColorPair(color: RgbColor): [RgbColor, RgbColor] {
        const hsvColor = rgb2hsv(color.r, color.g, color.b)
        if (hsvColor.v <= 20) {
            return this.generateBlackPair(hsvColor, color.a)
        }
        if (hsvColor.s <= 50) {
            return this.generateWhitePair(hsvColor)
        }
        return this.generateSaturatedPair(hsvColor)
    }
}
