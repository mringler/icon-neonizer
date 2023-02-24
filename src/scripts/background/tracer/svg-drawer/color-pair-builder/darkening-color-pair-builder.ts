import type { RgbColor } from "@image-tracer/core";
import type { HSV } from 'color-functions/dist/rgb2hsv';
import { ColorPairBuilder } from "./color-pair-builder";


export class DarkeningColorPairBuilder extends ColorPairBuilder {

    protected generateWhitePair(hsvColor: HSV): [RgbColor, RgbColor] {
        const h = (hsvColor.s === 0) ? Math.floor(Math.random() * 360) : hsvColor.h
        return [
            this.hsvToRgb({ h, s: hsvColor.s, v: hsvColor.v }),
            this.hsvToRgb({ h, s: 20, v: 20 }),
        ];
    }

    protected generateBlackPair(hsvColor: HSV, alpha: number): [RgbColor, RgbColor] {
        const h = (hsvColor.s === 0) ? Math.floor(Math.random() * 360) : hsvColor.h
        return [
            this.hsvToRgb({ h, s: hsvColor.s, v: hsvColor.v }, alpha),
            this.hsvToRgb({ h, s: 0, v: 0 }),
        ];
    }

    protected generateSaturatedPair(hsvColor: HSV): [RgbColor, RgbColor] {
        return [
            this.hsvToRgb({ h: hsvColor.h, s: 100, v: 100 }),
            this.hsvToRgb({ h: hsvColor.h, s: 100, v: 20 }),
        ];
    }
}