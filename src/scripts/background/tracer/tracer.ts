import { toFaviconDownloadUrl } from '@/util/to-favicon-download-url'
import {
    CreatePaletteMode,
    LayeringMode,
    FillStyle,
    TrimMode,
    ImageLoader,
    ImageTracer,
} from '@image-tracer-ts/browser'
import { IconStorage } from '../storage/icon-storage'
import { ColorBuilderOption, type GradientDrawerOptions, GradientDrawerOptionsUtil } from './svg-drawer/gradient-drawer-options'
import { SvgDrawerGradient } from './svg-drawer/svg-drawer-gradient'

export namespace Tracer {
    export async function traceUrl(
        iconUrl: string,
        customOptions: Partial<GradientDrawerOptions> | null = null
    ): Promise<string> {
        const url = toFaviconDownloadUrl(iconUrl)
        const imageData = await ImageLoader.loadUrl(url)
        return traceImageData(imageData, customOptions)
    }

    export async function traceBuffer(
        buffer: ArrayBuffer,
        customOptions: Partial<GradientDrawerOptions> | null = null
    ): Promise<string> {
        const imageData = await ImageLoader.loadImageDataFromBuffer(buffer)
        return traceImageData(imageData, customOptions)
    }

    export async function traceImageData(
        imageData: ImageData,
        customOptions: Partial<GradientDrawerOptions> | null = null
    ): Promise<string> {
        const options = await getOptions(customOptions)
        if (!customOptions?.strokeWidth) {
            options.strokeWidth = imageData.width > 100 ? 6 : 2
        }
        const drawer = new SvgDrawerGradient(options)
        const tracer = new ImageTracer(options)
        return tracer.traceImage(imageData, drawer)
    }

    export async function getOptions(
        options: Partial<GradientDrawerOptions> | null = null
    ): Promise<GradientDrawerOptions> {
        const storedOptions = (await IconStorage.loadOptions()) ?? getTracerOptionsPreset()
        const combinedOptions = Object.assign({}, storedOptions, options)
        return GradientDrawerOptionsUtil.buildFrom(combinedOptions)
    }

    export function getTracerOptionsPreset(): Partial<GradientDrawerOptions> {
        return {
            numberOfColors: 32,
            colorClusteringCycles: 3,
            colorSamplingMode: CreatePaletteMode.SCAN,
            lineFilter: false,
            layeringMode: LayeringMode.SEQUENTIAL,
            strokeWidth: 2,
            fillStyle: FillStyle.FILL,
            minShapeOutline: 15,
            desc: false,
            trim: TrimMode.KEEP_RATIO,
            verbose: false,
            minOpacityThreshold: 0.2,
            fullOpacityThreshold: 0.7,
            removeBackground: true,
            colorBuilder: ColorBuilderOption.adaptive,
        }
    }
}
