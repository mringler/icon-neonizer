import { RgbColor, RgbColorData } from "@image-tracer/core";
import type { HSV } from 'color-functions/dist/rgb2hsv';
import { ColorPairBuilder } from "./color-pair-builder";

const neonPink = 'rgb(245, 53, 170)';
const neonRed = 'rgb(247, 33, 25)'; // f72119
const neonPurple = 'rgb(102,83,255)'
const neonBlue = 'rgb(31, 81, 255)'
const neonGreen = 'rgb(15, 255, 80)'
const neonYellow = `rgb(204, 255, 21)`;

// from https://htmlcolorcodes.com/colors/
type ColorDef = HSV & RgbColorData & { name: string, hex: string }
const neonColors: ColorDef[] = [
    {
        name: 'Neon Red',
        hex: '#ff3131',
        h: 0, s: 81, v: 100,
        r: 255, g: 49, b: 49, a: 255,
    },{
        name: 'Neon Orange',
        hex: '#ff5f1f',
        h: 17, s: 88, v: 100,
        r: 255, g: 95, b: 31, a: 255,
    }, {
        name: 'Neon Yellow',
        hex: '#ccff15',
        h: 73, s: 92, v: 100,
        r: 204, g: 255, b: 21, a: 255,
    }, {
        name: 'Neon Green',
        hex: '#0fff50',
        h: 136, s: 94, v: 100,
        r: 15, g: 255, b: 80, a: 255,
    }, {
        name: 'Neon Blue',
        hex: '#1f51ff',
        h: 226, s: 88, v: 100,
        r: 31, g: 81, b: 255, a: 255,
    }, {
        name: 'Neon Pink',
        hex: '#ff10f0',
        h: 303, s: 94, v: 100,
        r: 255, g: 16, b: 240, a: 255,
    },
]

const colorHues = {
    red: 10, // ff5733
    orange: 17, // FF5F1F
    yellow: 73, // ccff15
    green: 136, // 0fff50
    lightBlue: 175,
    blue: 226, // 1F51FF
    purple: 280, // pink: FF10F0
}
// red 0
// orange: 25
// yellow 60
// green 135
// light blue 175
// blue 225
// purple 280

export class NeonColorPairBuilder extends ColorPairBuilder {

    protected generateWhitePair(hsvColor: HSV): [RgbColor, RgbColor] {
        return [new RgbColor(0,0,0,0), new RgbColor(0,0,0,0)]
        const h = (hsvColor.s === 0) ? Math.floor(Math.random() * 360) : hsvColor.h
        return [
            this.hsvToRgb({ h, s: 50, v: hsvColor.v }),
            this.hsvToRgb({ h: h, s: 0, v: 85 }),
        ]
    }

    protected generateBlackPair(hsvColor: HSV, alpha: number): [RgbColor, RgbColor] {
        return [new RgbColor(0,0,0,0), new RgbColor(0,0,0,0)]
        hsvColor.s = 100
        if (hsvColor.v < 15) {
            hsvColor.v = 10
        }
        return [
            this.hsvToRgb(hsvColor, alpha),
            new RgbColor(0, 0, 0, alpha)
        ];
    }

    // red 0
    // orange: 25
    // yellow 60
    // green 135
    // light blue 175
    // blue 225
    // purple 280

    protected getClosestNeonColor(hue: number): ColorDef {

        const ix = Math.round(0.0931253 * Math.pow(hue, 0.697349) + 0.1253) % neonColors.length
        return neonColors[ix]
    }

    protected getShiftedColor(colorDef: ColorDef):RgbColor{
        const keys : Array<keyof RgbColorData> = ['r','g','b']
        const entries = keys.map(c => [c, colorDef[c]] as [keyof RgbColorData, number]).sort( ([, v1], [, v2])  => v2 - v1)
        if(entries[1][1] - entries[2][1] < 15 && Math.random() < 0.5){
            [entries[1], entries[2]] = [entries[2], entries[1]]
        }
        entries[1][1] = 255
        const rgbColorData = Object.fromEntries(entries) as RgbColorData
        return RgbColor.fromRgbColorData(rgbColorData)
    }


    protected generateSaturatedPair(hsvColor: HSV): [RgbColor, RgbColor] {
        const colorDef = this.getClosestNeonColor(hsvColor.h)
        const rgb = RgbColor.fromRgbColorData(colorDef)
        const shiftedColor = this.getShiftedColor(colorDef)
        return [rgb, shiftedColor];
    }
}