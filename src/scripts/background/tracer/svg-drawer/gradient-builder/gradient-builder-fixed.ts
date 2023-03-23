import { GradientPoints, GradientBuilder } from './gradient-builder'

export class GradientBuilderFixed extends GradientBuilder {
    protected gradientPoints!: GradientPoints

    public constructor() {
        super()
        this.gradientPoints = super.selectGradientPoints()
    }

    protected selectGradientPoints(): GradientPoints {
        return this.gradientPoints
    }
}
