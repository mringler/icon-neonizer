declare module 'rgb-hsv' {
    export default function (r: number, g: number, b: number): [number, number, number]
}
declare module 'hsv-rgb' {
    export default function (r: number, g: number, b: number): [number, number, number]
}

declare module 'color-functions/dist/rgb2hsv' {
    export type HSV = { h: number; s: number; v: number }
    export default function (r: number, g: number, b: number): HSV
}
declare module 'color-functions/dist/hsv2rgb' {
    export type RGB = { r: number; g: number; b: number }
    export default function (h: number, s: number, v: number): RGB
}
