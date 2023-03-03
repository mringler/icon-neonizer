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
// https://vasilis.nl/nerd/code/human-colours/tests/hue-en-gb.php
type ColorDef = HSV & RgbColorData & { name: string, hex: string, startHue: number, endHue: number }
const neonColors: ColorDef[] = [
    {
        name: 'Neon Red',
        hex: '#ff3131',
        startHue: 345, endHue: 15,
        h: 0, s: 81, v: 100,
        r: 255, g: 49, b: 49,
    }, {
        name: 'Neon Orange',
        hex: '#ff5f1f',
        startHue: 16, endHue: 39,
        h: 17, s: 88, v: 100,
        r: 255, g: 95, b: 31,
    }, {
        name: 'Neon Yellow',
        hex: '#c6f714',
        startHue: 40, endHue: 80,
        h: 73, s: 92, v: 97,
        r: 198, g: 247, b: 20,
    }, {
        name: 'Neon Green',
        hex: '#0fff50',
        startHue: 81, endHue: 170,
        h: 136, s: 94, v: 100,
        r: 15, g: 255, b: 80,
    }, {
        name: 'Neon Light Blue',
        hex: '#04d9ff',
        startHue: 171, endHue:210,
        h: 189, s: 98, v: 100,
        r: 4, g: 217, b: 255,
    }, {
        name: 'Neon Blue',
        hex: '#1f51ff',
        startHue: 211, endHue: 246,
        h: 226, s: 88, v: 100,
        r: 31, g: 81, b: 255,
    }, {
        name: 'Neon Purple',
        hex: '#7d12ff',
        startHue: 247, endHue: 344,
        h: 267, s: 93, v: 100,
        r: 125, g: 18, b: 255,
    }, {
        name: 'Neon Pink',
        hex: '#ff10f0',
        startHue: 345, endHue: 15,
        h: 303, s: 94, v: 100,
        r: 255, g: 16, b: 240,
    },
]

const colorHues = {
    red: 0, // ff5733
    orange: 17, // FF5F1F
    yellow: 73, // ccff15
    green: 136, // 0fff50
    lightBlue: 175,
    blue: 226, // 1F51FF
    purple: 267,
    pink: 280, // pink: FF10F0
}

export class NeonColorPairBuilder extends ColorPairBuilder {

    protected generateWhitePair(hsvColor: HSV): [RgbColor, RgbColor] {
        const none = new RgbColor(0, 0, 0, 0)
        return [none, none]
    }

    protected generateBlackPair(hsvColor: HSV, alpha: number): [RgbColor, RgbColor] {
        return this.generateWhitePair(hsvColor)
    }

    // red 0
    // orange: 25
    // yellow 60
    // green 135
    // light blue 175
    // blue 225
    // purple 267
    // pink 280

    protected getClosestNeonColor(hue: number): ColorDef {
        return (hue > neonColors[0].startHue) ? neonColors[0] : neonColors.find(c => c.endHue >= hue)!
    }

    protected getShiftedColor(colorDef: ColorDef): RgbColor {
        const keys: Array<keyof RgbColorData> = ['r', 'g', 'b']
        const colorChannelEntries = keys.map(c => [c, colorDef[c]] as [keyof RgbColorData, number]).sort(([, v1], [, v2]) => v2 - v1)
        if (colorChannelEntries[1][1] - colorChannelEntries[2][1] < 15 && Math.random() < 0.5) {
            [colorChannelEntries[1], colorChannelEntries[2]] = [colorChannelEntries[2], colorChannelEntries[1]]
        }
        colorChannelEntries[1][1] = Math.min(colorChannelEntries[1][1] + 32, 255)
        const rgbColorData = Object.fromEntries(colorChannelEntries) as RgbColorData
        return RgbColor.fromRgbColorData(rgbColorData)
    }


    protected generateSaturatedPair(hsvColor: HSV): [RgbColor, RgbColor] {
        const colorDef = this.getClosestNeonColor(hsvColor.h)
        const rgb = RgbColor.fromRgbColorData(colorDef)
        const shiftedColor = this.getShiftedColor(colorDef)
        return [rgb, shiftedColor];
    }
}
