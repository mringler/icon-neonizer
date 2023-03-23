import { TraceData, RgbColor, SvgDrawer } from '@image-tracer/core'
import type { ColorPairBuilder } from './color-pair-builder/color-pair-builder'
import type { GradientBuilder, GradientTags } from './gradient-builder/gradient-builder'
import { GradientDrawerOptions } from './gradient-drawer-options'

export class SvgDrawerGradient extends SvgDrawer {
    protected colorToGradientId = new Map<RgbColor, string>()
    protected gradients: Record<string, GradientTags> = {}

    protected height: number = 48
    protected width: number = 48

    protected colorPairBuilder: ColorPairBuilder
    protected gradientBuilder: GradientBuilder
    protected fullOpacityThreshold: number
    protected minOpacityThreshold: number
    protected removeBackground: boolean

    public constructor(options: Partial<GradientDrawerOptions>) {
        super(options)
        this.colorPairBuilder = GradientDrawerOptions.getColorPairBuilderFromOption(options.colorBuilder)
        this.gradientBuilder = GradientDrawerOptions.getGradientBuilderFromOption(options.gradientBuilder)
        const getBoundVal = (val: number | undefined) => !val && val !== 0 ? 1 : Math.max(0, Math.min(Number(val), 1))
        this.fullOpacityThreshold = getBoundVal(options.fullOpacityThreshold)
        this.minOpacityThreshold = getBoundVal(options.minOpacityThreshold)
        this.removeBackground = Boolean(options.removeBackground)
    }

    public init(traceData: TraceData): void {
        this.fullOpacityThreshold < 1 && this.adjustColorOpacity(traceData)
        this.minOpacityThreshold > 0 && this.removeTransparentShapes(traceData)
        this.removeBackground && this.removeBackgroundArea(traceData)
        this.colorPairBuilder.init(traceData)
        super.init(traceData)
        this.setDimensions(traceData)
        this.gradientBuilder.init(traceData, this.options.scale)
    }

    protected removeTransparentShapes(traceData: TraceData) {
        const minValue = 255 * this.minOpacityThreshold
        traceData.colors.forEach(
            (color, ix) => color.a <= minValue && (traceData.areasByColor[ix] = [])
        )
    }

    protected removeBackgroundArea(traceData: TraceData) {
        const [colorIx, areaIx] = this.findBackgroundIndex(traceData)
        if (colorIx === undefined || areaIx === undefined) {
            return
        }
        const areas = traceData.areasByColor[colorIx]
        const removeIds = new Uint16Array([areaIx, ...areas[areaIx].childHoles]).sort()
        removeIds.reduceRight((_, ix) => areas.splice(ix, 1), [] as typeof areas)
        for (const area of areas) {
            area.childHoles = area.childHoles.map(ix => {
                const shift = removeIds.findIndex(removedId => ix < removedId)
                return ix - (shift === -1 ? removeIds.length : shift)
            })
        }
    }

    protected findBackgroundIndex(traceData: TraceData): [number, number] | undefined[] {
        const { width: w, height: h } = traceData

        const hasPoint = (
            lines: TraceData['areasByColor'][number][number]['lineAttributes'],
            x: number,
            y: number
        ) => {
            let startsAt = false,
                endsAt = false
            for (let lineIx = 0; lineIx < lines.length && !(startsAt && endsAt); lineIx++) {
                startsAt ||= lines[lineIx].x1 === x && lines[lineIx].y1 === y
                endsAt ||= lines[lineIx].x2 === x && lines[lineIx].y2 === y
            }
            return startsAt && endsAt
        }

        const isBackground = (area: TraceData['areasByColor'][number][number]) => {
            const lines = area.lineAttributes
            return (
                !area.isHole &&
                lines.length >= 4 &&
                area.boundingBox[0] === 0 &&
                area.boundingBox[1] === 0 &&
                area.boundingBox[2] === w &&
                area.boundingBox[3] === h &&
                [[0, 0], [w, 0], [w, h], [0, h]].reduce((foundPoints, [x, y]) => foundPoints || hasPoint(area.lineAttributes, x, y), false)

            )
        }
        for (let colorIx = 0; colorIx < traceData.areasByColor.length; colorIx++) {
            const areas = traceData.areasByColor[colorIx]
            for (let areaIx = 0; areaIx < areas.length; areaIx++) {
                if (!isBackground(areas[areaIx])) {
                    continue
                }
                return [colorIx, areaIx]
            }
        }
        return []
    }

    protected adjustColorOpacity(traceData: TraceData) {
        if (this.fullOpacityThreshold >= 1) {
            return
        }
        const threshold = 255 * this.fullOpacityThreshold
        for (const color of traceData.colors) {
            if (color.a < threshold) {
                continue
            }
            color.a = 255
        }
    }

    protected setDimensions(traceData: TraceData) {
        this.width = traceData.width
        this.height = traceData.height
    }

    protected buildSvgTag(traceData: TraceData, tags: string[]): string {
        const gradients = Object.values(this.gradients).flat()
        if (gradients.length) {
            gradients.unshift('<defs>')
            gradients.push('</defs>')
        }
        return super.buildSvgTag(traceData, gradients.concat(tags))
    }

    protected buildGradientForColor(color: RgbColor): string {
        const [id, gradientTags] = this.gradientBuilder.generateGradient(
            color,
            this.colorPairBuilder
        )
        this.registerGradient(id, color, gradientTags)

        return id
    }

    protected registerGradient(id: string, color: RgbColor, gradientTags: GradientTags): void {
        this.gradients[id] = gradientTags
        this.colorToGradientId.set(color, id)
    }

    protected colorToRgbString(color: RgbColor): string {
        if (this.colorPairBuilder.isTooDark(color)) {
            return super.colorToRgbString(color)
        }

        const id = this.colorToGradientId.get(color) ?? this.buildGradientForColor(color)

        return `url(#${id})`
    }
}
