import { RgbColor, TraceData } from "@image-tracer/core";
import type { ColorPairBuilder } from "./svg-drawer/color-pair-builder/color-pair-builder";
import type { GradientBuilder, GradientTags } from "./svg-drawer/gradient-builder/gradient-builder";
import { GradientDrawerOptions } from "./svg-drawer/gradient-drawer-options";

type ColorHash = `#${number}`
type ColorData = {
    rgb: RgbColor,
    hash: ColorHash,
    id: string,
    gradient: GradientTags,
}
type ColorMap = Record<string, ColorData>
type SvgColorElements = SVGPathElement | SVGCircleElement | SVGRectElement

export namespace SvgColorReplacer {
    export function replaceColorsInSvg(
        svgString: string,
        customOptions?: Partial<GradientDrawerOptions>
    ): string {
        const svgDom = parseSvg(svgString)
        const paths = svgDom.querySelectorAll<SvgColorElements>('path,circle,rect')

        const colorDataBuilder = new ColorDataBuilder(svgDom, customOptions)
        const colorMap = updatePathColors(colorDataBuilder, paths)

        fixupSvg(svgDom)
        insertGradientsIntoSvg(svgDom, colorMap)
        return new XMLSerializer().serializeToString(svgDom)
    }

    function fixupSvg(svgDocument: Document) {
        const svgNode = svgDocument.querySelector('svg')!
        svgNode.removeAttribute('width')
        svgNode.removeAttribute('height')
        svgNode.querySelectorAll('style').forEach(style => style.remove())
    }

    export function parseSvg(svgString: string): Document {
        const svgDocument = new DOMParser().parseFromString(svgString, 'image/svg+xml')
        const errorNode = svgDocument.querySelector('parsererror');
        if (errorNode) {
            throw new Error('Error parsing SVG: ' + errorNode.textContent)
        }
        return svgDocument
    }

    function insertGradientsIntoSvg(svgDocument: Document, colorMap: ColorMap) {
        const gradients = Object.values(colorMap).flatMap(colorData => colorData.gradient).join('')
        const svgNode = svgDocument.querySelector('svg')
        if (!gradients || !svgNode) {
            return
        }
        const defs = svgDocument.createElementNS(svgNode.getAttribute('xmlns'), 'defs')
        defs.innerHTML = gradients
        svgNode.prepend(defs)
    }

    function updatePathColors(colorDataBuilder: ColorDataBuilder, paths: NodeListOf<SvgColorElements>): ColorMap {
        const colorMap: ColorMap = {}
        const colorProps = ['fill', 'stroke'] as const
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i]
            const style = getComputedStyle(path)
            for (const prop of colorProps) {
                const colorString = path.getAttribute(prop) ?? style[prop]
                if (colorString === 'none') {
                    continue
                }
                const colorData = colorDataBuilder.buildColorData(colorString)!
                colorMap[colorString] = colorData
                path.setAttribute(prop, `url(#${colorData.id})`)
            }
        }

        return colorMap
    }

    class ColorDataBuilder {

        protected colorPairBuilder: ColorPairBuilder
        protected gradientBuilder: GradientBuilder
        protected colorStringToColorData: Record<string, ColorData> = {}

        public constructor(svgDom: Document, customOptions?: Partial<GradientDrawerOptions>) {
            this.colorPairBuilder = GradientDrawerOptions.getColorPairBuilderFromOption(customOptions?.colorBuilder)
            this.gradientBuilder = GradientDrawerOptions.getGradientBuilderFromOption(customOptions?.gradientBuilder)

            const traceData = this.buildMockTraceData(svgDom)
            this.gradientBuilder.init(traceData, customOptions?.scale ?? 1)
        }

        protected buildMockTraceData(svgDom: Document): TraceData {
            const bBox = svgDom.querySelector('svg')?.getBBox()

            return {
                areasByColor: [],
                colors: [],
                height: bBox?.height ?? 0,
                width: bBox?.width ?? 0,
            }
        }

        public buildColorData(colorString: string): ColorData | null {
            if (colorString === 'none') {
                return null
            }

            if (!this.colorStringToColorData[colorString]) {
                const rgb = this.colorStringToRgbColor(colorString)
                const hash = rgb.toCssColorHex()
                const [id, gradient] = this.gradientBuilder.generateGradient(rgb, this.colorPairBuilder)
                this.colorStringToColorData[colorString] = { rgb, hash, id, gradient }
            }
            return this.colorStringToColorData[colorString]
        }

        protected colorStringToRgbColor(colorString: string): RgbColor {
            if(colorString.startsWith('#')){
                return this.hexToRgbA(colorString)
            }
            const rgba = colorString.split("(")[1].split(")")[0].split(",").map(s => parseInt(s))
            return new RgbColor(...rgba)
        }

        protected hexToRgbA(hex: string) {
            if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
                throw new Error('Bad Hex');
            }
            let chars = hex.substring(1).split('');
            if (chars.length < 6) {
                chars = chars.flatMap(c => [c,c])
            }
            if (chars.length < 8) {
                chars.push('ff')
            }
            const val = Number('0x' + chars.join(''));
            const rgba = Array.from({length: 4}, (_,i) => (val >> (8 * (3 - i))) & 255)
            return new RgbColor(...rgba)
        }
    }
}