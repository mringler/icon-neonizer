import type { RgbColor } from "@image-tracer/core";

export interface ColorPairBuilder{
    generateColorPair(color: RgbColor): [RgbColor, RgbColor];
}