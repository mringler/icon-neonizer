import { FillStyle, RgbColor } from "@image-tracer-ts/browser"
import type { ColorExtractor, RgbColorAndHash } from "./color-extractor"
import type { ColorStringToGradientDataMap } from "./color-gradient-map-builder"
import type { GradientDrawerOptions } from "../gradient-drawer-options"

export type SvgColorElements = SVGPathElement | SVGCircleElement | SVGRectElement
export type ColorStringMap = Map<string, RgbColorAndHash>
export type PathWithColors = { path: SvgColorElements, stroke?: string, fill?: string }


export class SvgPathEditor {
    colorStringMap: ColorStringMap
    pathWithColors: PathWithColors[]
    useStroke: boolean
    useFill: boolean
    strokeWidth: number
    colorExtractor: ColorExtractor


    constructor(svgDom: Document, colorExtractor: ColorExtractor, customOptions: Partial<GradientDrawerOptions> | undefined) {
        this.useStroke = Boolean(customOptions?.fillStyle) && customOptions?.fillStyle  !== FillStyle.FILL
        this.useFill = customOptions?.fillStyle !== FillStyle.STROKE
        this.strokeWidth = customOptions?.strokeWidth ?? 1
        this.colorExtractor = colorExtractor

        this.pathWithColors = this.extractPathColors(svgDom)
        this.colorStringMap = this.extractColorStringMap(this.pathWithColors)
    }

    protected extractPathColors(svgDom: Document): PathWithColors[] {
        const pathWithColors: PathWithColors[] = []
        const paths = svgDom.querySelectorAll<SvgColorElements>('path,circle,rect')
        const colorProps = ['fill', 'stroke'] as const
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i]
            const pathWithColor: PathWithColors = { path, stroke: undefined, fill: undefined }
            const style = getComputedStyle(path)
            for (const prop of colorProps) {
                const colorString = path.getAttribute(prop) ?? path.style[prop] ?? style[prop]
                if (colorString === 'none' || colorString.startsWith('url(')) {
                    continue
                }
                pathWithColor[prop] = colorString
            }
            pathWithColors.push(pathWithColor)
        }
        if (this.useStroke) {
            pathWithColors.forEach(pathWithColor => {
                pathWithColor.fill && (pathWithColor.stroke = pathWithColor.fill)
                !this.useFill && (pathWithColor.fill = undefined)
            })
        }
        return pathWithColors
    }

    protected extractColorStringMap(pathWithColors: PathWithColors[]): ColorStringMap {
        const colorStrings = pathWithColors.map(c => c.fill).concat(this.pathWithColors.map(c => c.stroke)).filter(Boolean) as string[]
        const colorStringMap = new Map<string, RgbColorAndHash>()
        for (const colorString of colorStrings) {
            if (colorStringMap.has(colorString)) continue
            colorStringMap.set(colorString, this.colorExtractor.extract(colorString))
        }

        return colorStringMap
    }

    public getRgbColors(): RgbColor[] {
        const rgbColors: RgbColor[] = []
        for (const { rgb } of this.colorStringMap.values()) {
            rgbColors.push(rgb)
        }
        return rgbColors
    }

    public updatePaths(colorMap: ColorStringToGradientDataMap): void {
        const colorProps = ['fill', 'stroke'] as const
        for (const pathColor of this.pathWithColors) {
            for (const prop of colorProps) {
                pathColor.path.style.removeProperty(prop)
                if (!this.useFill && prop === 'fill') {
                    pathColor.path.setAttribute(prop, 'none')
                    continue
                }
                const colorString = pathColor[prop]
                if (!colorString) {
                    continue
                }

                let colorData = colorMap.get(colorString)
                if (!colorData) {
                    console.error('color string is missing in map:', colorString, colorMap)
                    continue
                }
                pathColor.path.setAttribute(prop, `url(#${colorData.id})`)
            }
            if (this.strokeWidth > 1 && pathColor.stroke) {
                pathColor.path.setAttribute('stroke-width', String(this.strokeWidth))
            }
        }
    }
}
