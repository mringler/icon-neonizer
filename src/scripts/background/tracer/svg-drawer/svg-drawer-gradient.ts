import { TraceData, RgbColor, SvgDrawerOptions, SvgDrawer } from "@image-tracer/core";
import type { ColorPairBuilder } from "./color-pair-builder/color-pair-builder";
import type { GradientBuilder, GradientTags } from "./gradient-builder/gradient-builder";
import { GradientDrawerOptions } from "./gradient-drawer-options";



export class SvgDrawerGradient extends SvgDrawer {

    protected colorToGradientId = new Map<RgbColor, string>();
    protected gradients: Record<string, GradientTags> = {}

    protected height: number = 48
    protected width: number = 48

    protected colorPairBuilder: ColorPairBuilder
    protected gradientBuilder: GradientBuilder
    protected fullOpacityThreshold: number

    public constructor(
        options: Partial<GradientDrawerOptions>,
        version: string,
    ) {
        super(options, version);
        this.colorPairBuilder = GradientDrawerOptions.getColorPairBuilderFromOption(options.colorBuilder)
        this.gradientBuilder = GradientDrawerOptions.getGradientBuilderFromOption(options.gradientBuilder)
        const ot = options.fullOpacityThreshold
        this.fullOpacityThreshold = !ot && ot !== 0 ? 1 : Math.max(0, Math.min(Number(ot), 1))
    }

    public draw(traceData: TraceData): string {
        this.setDimensions(traceData)
        this.gradientBuilder.init(traceData, this.options.scale)

        this.adjustColorOpacity(traceData)

        return super.draw(traceData)
    }

    protected adjustColorOpacity(traceData: TraceData){
        if(this.fullOpacityThreshold >= 1){
            return
        }
        const threshold = 255 * this.fullOpacityThreshold
        for(let color of traceData.colors){
            if(color.a < threshold){
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
        const id = this.generateGradientId(color)
        const gradientTags = this.gradientBuilder.generateGradient(id, color, this.colorPairBuilder);
        this.registerGradient(id, color, gradientTags)

        return id
    }

    protected registerGradient(id: string, color: RgbColor, gradientTags: GradientTags): void {
        this.gradients[id] = gradientTags;
        this.colorToGradientId.set(color, id)
    }

    protected generateGradientId(color: RgbColor): string {
        const colorId = color.toCssColorHex().substring(1)
        const randomChars = (Math.random() + 1).toString(36).substring(8)
        return `${randomChars}_${colorId}`
    }

    protected colorToRgbString(color: RgbColor): string {
        if (this.colorPairBuilder.isTooDark(color)) {
            return super.colorToRgbString(color)
        }

        const id = this.colorToGradientId.get(color) ?? this.buildGradientForColor(color)

        return `url(#${id})`
    }



    /**
     * Finds the value in the middle of three values.
     * 
     * Returns the larger one if two are equal.
     * @param r 
     * @param g 
     * @param b 
     * @returns 
     */
    protected mid(r: number, g: number, b: number): number {
        if (r < g) {
            if (b < r) return r;
            if (g < b) return g;
            return b
        }
        if (b < g) return g;
        if (r < b) return r;
        return b
    }
}