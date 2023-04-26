import type { GradientDrawerOptions } from "../gradient-drawer-options"
import { ColorGradientMapBuilder, ColorStringToGradientDataMap } from "./color-gradient-replacer"
import { SvgPathEditor } from "./svg-path-editor"

export namespace SvgColorReplacer {
    export function replaceColorsInSvg(
        svgString: string,
        customOptions?: Partial<GradientDrawerOptions>
    ): string {
        const svgDom = parseSvg(svgString)
        const pathEditor = new SvgPathEditor(svgDom, customOptions)
        const colorDataBuilder = new ColorGradientMapBuilder(svgDom, pathEditor.getRgbColors(), customOptions)
        const colorGradientMap = colorDataBuilder.buildColorGradients(pathEditor.colorStringMap)
        pathEditor.updatePaths(colorGradientMap)

        fixupSvg(svgDom)
        insertGradientsIntoSvg(svgDom, colorGradientMap)
        return new XMLSerializer().serializeToString(svgDom)
    }

    export function parseSvg(svgString: string): Document {
        const svgDocument = new DOMParser().parseFromString(svgString, 'image/svg+xml')
        const errorNode = svgDocument.querySelector('parsererror')
        if (errorNode) {
            throw new Error('Error parsing SVG: ' + errorNode.textContent)
        }
        return svgDocument
    }

    function fixupSvg(svgDocument: Document) {
        const svgNode = svgDocument.querySelector('svg')!
        svgNode.removeAttribute('width')
        svgNode.removeAttribute('height')
        svgNode.querySelectorAll('style').forEach((style) => style.remove())
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
