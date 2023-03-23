import type { TraceData } from '@image-tracer/core'
import { GradientPoints, GradientBuilder } from './gradient-builder'

export class GradientBuilderDirected extends GradientBuilder {
    public constructor(protected scale: number) {
        super()
    }

    public init(traceData: TraceData, scale: number) {}

    protected buildBoundedGradients(traceData: TraceData) {
        for (let colorId = 0; colorId < traceData.colors.length; colorId++) {
            const areas = traceData.areasByColor[colorId]

            let minX = traceData.width,
                maxX = 0,
                minY = traceData.height,
                maxY = 0
            let hasArea = false
            for (const area of areas) {
                //if (!this.isValidLine(color, area.lineAttributes)) {
                //   continue
                //}
                hasArea = true
                minX = Math.min(minX, area.boundingBox[0])
                minY = Math.min(minY, area.boundingBox[1])
                maxX = Math.max(maxX, area.boundingBox[2])
                maxY = Math.max(maxY, area.boundingBox[3])
            }
            if (!hasArea) {
                continue
            }
            const s = this.scale
            return this.buildBoundedGradient([s * minX, s * maxX], [s * minY, s * maxY])
        }
    }

    protected buildBoundedGradient(
        xRange: [number, number],
        yRange: [number, number]
    ): GradientPoints {
        const gradientPoints = super.selectGradientPoints()
        gradientPoints.x1 = xRange[gradientPoints.x1]
        gradientPoints.x2 = xRange[gradientPoints.x2]
        gradientPoints.y1 = yRange[gradientPoints.y1]
        gradientPoints.y2 = yRange[gradientPoints.y2]

        return gradientPoints
    }
}
