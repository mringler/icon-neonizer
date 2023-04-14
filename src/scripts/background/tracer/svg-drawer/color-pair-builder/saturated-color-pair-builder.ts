import { RgbColor } from '@image-tracer-ts/core'
import type { HSV } from 'color-functions/dist/rgb2hsv'
import { ColorPairBuilder } from './color-pair-builder'

export class SaturatedColorPairBuilder extends ColorPairBuilder {
    protected generateWhitePair(hsvColor: HSV): [RgbColor, RgbColor] {
        const h = hsvColor.s === 0 ? Math.floor(Math.random() * 360) : hsvColor.h
        return [
            this.hsvToRgb({ h, s: 50, v: hsvColor.v }),
            this.hsvToRgb({ h: h, s: 0, v: 100 }),
        ]
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
