import { toFaviconDownloadUrl } from '@/util/to-favicon-download-url';
import {
    ImageTracerBrowser, CreatePaletteMode, LayeringMode,
    FillStyle, TrimMode, ImageLoader
} from '@image-tracer/browser';
import { IconStorage } from '../storage/icon-storage';
import { GradientDrawerOptions } from './svg-drawer/gradient-drawer-options';
import { SvgDrawerGradient } from './svg-drawer/svg-drawer-gradient';

export namespace Tracer {

    export async function traceUrl(
        iconUrl: string,
        customOptions: Partial<GradientDrawerOptions> | null = null
    ): Promise<string> {
        const url = toFaviconDownloadUrl(iconUrl)
        const imageData = await ImageLoader.loadUrl(url);
        return traceImageData(imageData, customOptions)
    }

    export async function traceBuffer(
        buffer: ArrayBuffer,
        customOptions: Partial<GradientDrawerOptions> | null = null
    ): Promise<string> {
        const imageData = await ImageLoader.loadImageDataFromBuffer(buffer);
        return traceImageData(imageData, customOptions)
    }

    export async function traceImageData(
        imageData: ImageData,
        customOptions: Partial<GradientDrawerOptions> | null = null
    ): Promise<string> {
        const options = await getOptions(customOptions);
        if (!customOptions?.strokewidth) {
            options.strokewidth = imageData.width > 100 ? 6 : 2;
        }
        const drawer = new SvgDrawerGradient(options, '');
        return ImageTracerBrowser.fromImageData(imageData, options, drawer);
    }

    export async function getOptions(options: Partial<GradientDrawerOptions> | null = null): Promise<GradientDrawerOptions> {
        const storedOptions = await IconStorage.loadOptions() ?? getTracerOptions()
        const combinedOptions = Object.assign({}, storedOptions, options)
        return GradientDrawerOptions.buildFrom(combinedOptions)
    }

    function getTracerOptions(): Partial<GradientDrawerOptions> {
        return {
            numberofcolors: 32,
            colorsampling: CreatePaletteMode.SCAN,
            linefilter: false,
            layering: LayeringMode.SEQUENTIAL,
            strokewidth: 2,
            fillstyle: FillStyle.FILL,
            pathomit: 15,
            colorquantcycles: 3,
            desc: false,
            trim: TrimMode.KEEP_RATIO,
            verbose: false,
            minOpacityThreshold: 0.15,
            removeBackground: true,
        };
    }
}
