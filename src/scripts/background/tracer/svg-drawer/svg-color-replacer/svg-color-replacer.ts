import type { GradientDrawerOptions } from "../gradient-drawer-options"
import { ColorExtractor } from "./color-extractor"
import { ColorGradientMapBuilder, ColorStringToGradientDataMap } from "./color-gradient-map-builder"
import { SvgPathEditor } from "./svg-path-editor"


export namespace SvgColorReplacer {
    export function replaceColorsInSvg(
        svgString: string,
        customOptions?: Partial<GradientDrawerOptions>
    ): string {
        const svgDom = parseSvg(svgString)
        const colorExtractor = new ColorExtractor((customOptions?.fullOpacityThreshold ?? 1) * 255)
        const pathEditor = new SvgPathEditor(svgDom, colorExtractor, customOptions)
        const colorDataBuilder = new ColorGradientMapBuilder(svgDom, pathEditor.getRgbColors(), customOptions)
        const colorGradientMap = colorDataBuilder.buildColorGradients(pathEditor.colorStringMap)
        pathEditor.updatePaths(colorGradientMap)

        fixupSvg(svgDom)
        fixupExistingGradients(svgDom, colorExtractor, colorDataBuilder)
        insertGradientsIntoSvg(svgDom, colorGradientMap)
        const svgNode = svgDom.querySelector('svg')
        return svgNode ? new XMLSerializer().serializeToString(svgNode) : svgString
    }

    export function parseSvg(svgString: string): Document {
        const svgDocument = new DOMParser().parseFromString(svgString, 'image/svg+xml')
        const errorNode = svgDocument.querySelector('parsererror')
        if (errorNode) {
            throw new Error('Error parsing SVG: ' + errorNode.textContent)
        }
        return svgDocument
    }


    function fixupExistingGradients(svgDom: Document, colorExtractor: ColorExtractor, colorDataBuilder: ColorGradientMapBuilder) {
        const stops = svgDom.querySelectorAll<SVGStopElement>('linearGradient stop')
        stops.forEach(stop => {
            const stopColorString = stop.getAttribute('stop-color')
            if (!stopColorString) return
            const stopColor = colorExtractor.extract(stopColorString)
            const updatedColor = colorDataBuilder.findSingleColorReplacement(stopColor.rgb)
            stop.setAttribute('stop-color', updatedColor.toCssColorHex())
        })

        const gradients = svgDom.querySelectorAll<SVGLinearGradientElement>('linearGradient')
        gradients.forEach(gradient => {
            const id = gradient.id
            if (!id) return
            const updatedId = id + '_' + (Math.random() + 1).toString(36).substring(7)
            gradient.id = updatedId
            const ref = `url(#${updatedId})`
            for (const paint of ['stroke', 'fill']) {
                svgDom.querySelectorAll(`[${paint}="url(#${id})"]`).forEach(node => node.setAttribute(paint, ref))
            }
        })
    }

    function fixupSvg(svgDocument: Document) {
        const svgNode = svgDocument.querySelector('svg')!
        if (!svgNode.getAttribute('viewBox')) {
            setViewBox(svgNode)
        }
        svgNode.removeAttribute('width')
        svgNode.removeAttribute('height')
        svgNode.querySelectorAll('style').forEach((style) => style.remove())
    }

    function setViewBox(svgNode: SVGElement): void {
        const width = svgNode.getAttribute('width')
        const height = svgNode.getAttribute('height')
        if (!width && !height) {
            return
        }
        const w = Number(width ?? height)
        const h = Number(height ?? width)
        const viewBox = `0 0 ${w} ${h}`
        svgNode.setAttribute('viewBox', viewBox)
    }


    function insertGradientsIntoSvg(svgDocument: Document, colorMap: ColorStringToGradientDataMap) {
        const gradients = [...colorMap.values()]
            .flatMap((colorData) => colorData.gradient)
            .join('')
        const svgNode = svgDocument.querySelector('svg')
        if (!gradients || !svgNode) {
            return
        }
        const defs = svgDocument.createElementNS(svgNode.getAttribute('xmlns'), 'defs')
        defs.innerHTML = gradients
        svgNode.prepend(defs)
    }
}
