import { RgbColor } from "@image-tracer-ts/browser"

export type RgbColorAndHash = { rgb: RgbColor, hash: ColorHash }
export type ColorHash = `#${number}`

type RgbaArray = [r: number, g: number, b: number, a?: number]

export class ColorExtractor {

    constructor(
        protected fullOpacityThreshold: number
    ) { }

    public extract(colorString: string): RgbColorAndHash {
        const rgb = this.colorStringToRgbColor(colorString)
        const hash = rgb.toCssColorHex()
        return { rgb, hash }
    }

    protected colorStringToRgbColor(colorString: string): RgbColor {
        const rgba = this.extractRgba(colorString)

        if(this.fullOpacityThreshold < 255 && rgba[3] && rgba[3] < this.fullOpacityThreshold){
            rgba[3] = 255
        }

        return new RgbColor(...rgba)
    }

    protected extractRgba(colorString: string): RgbaArray {
        if (colorString.startsWith('#')) {
            return this.hexToRgbA(colorString)
        }
        return colorString
            .split('(')[1]
            .split(')')[0]
            .split(',')
            .map((s) => parseInt(s)) as RgbaArray
    }

    protected hexToRgbA(hex: string): RgbaArray {
        if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            throw new Error('Bad Hex')
        }
        let chars = hex.substring(1).split('')
        if (chars.length < 6) {
            chars = chars.flatMap((c) => [c, c])
        }
        if (chars.length < 8) {
            chars.push('ff')
        }
        const val = Number('0x' + chars.join(''))
        return Array.from({ length: 4 }, (_, i) => (val >> (8 * (3 - i))) & 255) as RgbaArray
    }
}
