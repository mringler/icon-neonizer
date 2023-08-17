import { RgbColor, RgbColorData } from '@image-tracer-ts/core'
import rgb2hsv, { type HSV } from 'color-functions/dist/rgb2hsv'
import hsv2rgb from 'color-functions/dist/hsv2rgb'
import { ColorPairBuilder } from './color-pair-builder'

export class SaturatedColorPairBuilder extends ColorPairBuilder {
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

    protected generateWhitePair(hsvColor: HSV): [RgbColor, RgbColor] {
        const h = hsvColor.s === 0 ? Math.floor(Math.random() * 360) : hsvColor.h
        return [this.hsvToRgb({ h, s: 50, v: hsvColor.v }), this.hsvToRgb({ h: h, s: 0, v: 100 })]
    }

    protected generateBlackPair(hsvColor: HSV, alpha: number): [RgbColor, RgbColor] {
        hsvColor.s = 100
        if (hsvColor.v < 15) {
            hsvColor.v = 10
        }
        return [this.hsvToRgb(hsvColor, alpha), new RgbColor(0, 0, 0, alpha)]
    }

    protected generateSaturatedPair(hsvColor: HSV): [RgbColor, RgbColor] {
        hsvColor.s = 100
        hsvColor.v = 100

        const shiftedColor = { ...hsvColor }
        let hueShift = Math.random() < 0.5 ? -30 : 30
        const rand = Math.random()
        if (rand < 0.3) {
            hueShift <<= 1
        } else if (rand < 0.6) {
            shiftedColor.s = 50
        } else {
            shiftedColor.s = 50
            hueShift = 0
        }
        shiftedColor.h = (shiftedColor.h + hueShift + 360) % 360
        return [this.hsvToRgb(hsvColor), this.hsvToRgb(shiftedColor)]
    }
}
