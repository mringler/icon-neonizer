import { Options } from "@image-tracer/core";
import type { ColorPairBuilder } from "./color-pair-builder/color-pair-builder";
import { DarkeningColorPairBuilder } from "./color-pair-builder/darkening-color-pair-builder";
import { LighteningColorPairBuilder } from "./color-pair-builder/lightening-color-pair-builder";
import { NeonColorPairBuilder } from "./color-pair-builder/neon-color-pair-builder";
import { PreSelectedColorPairBuilder } from "./color-pair-builder/pre-selected-color-pair-builder.";
import { SaturatedColorPairBuilder } from "./color-pair-builder/saturated-color-pair-builder";
import { GradientBuilder } from "./gradient-builder/gradient-builder";
import { GradientBuilderFixed } from "./gradient-builder/gradient-builder-fixed";
import { GradientBuilderFlat } from "./gradient-builder/gradient-builder-flat";

export enum ColorBuilderOption {
    darken = 'darken',
    lighten = 'lighten',
    saturate = 'saturate',
    neon = 'neon',
    whiteout = 'whiteout'
}

export enum GradientBuilderOption {
    flat = 'flat', // same gradient across the canvas for all colors 
    fixed = 'fixed', // same direction for all gradients
    random = 'random', // random gradient direction for every color
}

export interface GradientDrawerOptions extends Options {
    colorBuilder: ColorBuilderOption,
    gradientBuilder: GradientBuilderOption,
}

export namespace GradientDrawerOptions {
    export function getColorPairBuilderFromOption(option?: ColorBuilderOption): ColorPairBuilder {
        switch (option) {
            case ColorBuilderOption.darken: return new DarkeningColorPairBuilder()
            case ColorBuilderOption.lighten: return new LighteningColorPairBuilder()
            case ColorBuilderOption.neon: return new NeonColorPairBuilder()
            case ColorBuilderOption.whiteout: return new PreSelectedColorPairBuilder()
            case ColorBuilderOption.saturate:
            default:
                return new SaturatedColorPairBuilder()
        }
    }

    export function getGradientBuilderFromOption(option?: GradientBuilderOption): GradientBuilder {
        switch (option) {
            case GradientBuilderOption.fixed: return new GradientBuilderFixed()
            case GradientBuilderOption.flat: return new GradientBuilderFlat()
            case GradientBuilderOption.random:
            default:
                return new GradientBuilder()
        }
    }

    export function buildFrom(options: Partial<GradientDrawerOptions> ): GradientDrawerOptions{
        const mainOptions =  Options.buildFrom(options) as GradientDrawerOptions
        mainOptions.gradientBuilder ??= GradientBuilderOption.random
        mainOptions.colorBuilder ??= ColorBuilderOption.saturate
        return mainOptions
    }
}