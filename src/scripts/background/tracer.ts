import { faviconDownloadUrl } from '@/util/favicon-download-url-filter';
import {
    ImageTracerBrowser, CreatePaletteMode, LayeringMode,
    FillStyle, TrimMode, ImageLoader
} from '@image-tracer/browser';
import { IconStorage } from './icon-storage';
import { GradientDrawerOptions } from './svg-drawer/gradient-drawer-options';
import { SvgDrawerGradient } from './svg-drawer/svg-drawer-gradient';

export namespace Tracer {

    export async function traceUrl(
        iconUrl: string,
        customOptions: Partial<GradientDrawerOptions> | null = null
    ): Promise<string> {
        const options = await getOptions(customOptions);
        const url = faviconDownloadUrl(iconUrl)
        const imageData = await ImageLoader.loadUrl(url);
        if (!customOptions?.strokewidth) {
            options.strokewidth = imageData.width > 100 ? 6 : 2;
        }
        const drawer = new SvgDrawerGradient(options, '');
        return ImageTracerBrowser.fromImageData(imageData, options, drawer);
    }

    export async function traceBuffer(
        buffer: ArrayBuffer,
        options: Partial<GradientDrawerOptions> | null = null
    ): Promise<string> {
        options = await getOptions(options);
        const drawer = new SvgDrawerGradient(options, '');
        return ImageTracerBrowser.fromBuffer(buffer, options, drawer);
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
            fillstyle: FillStyle.STROKE,
            pathomit: 8,
            colorquantcycles: 3,
            desc: false,
            //numberofcolors: 32
            trim: TrimMode.KEEP_RATIO,

        };
    }
}
