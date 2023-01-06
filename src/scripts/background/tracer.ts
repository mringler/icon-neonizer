import {
    ImageTracerBrowser, CreatePaletteMode, LayeringMode,
    Options, FillStyle, TrimMode, ImageLoader
} from '@image-tracer/browser';
import { SvgDrawerGradient } from './svg-drawer-gradient';

export namespace Tracer {

    export async function traceUrl(
        iconUrl: string,
        customOptions: Partial<Options> | null = null
    ): Promise<string> {
        const options = getOptions(customOptions);
        const imageData = await ImageLoader.loadUrl(iconUrl);
        if (!customOptions?.strokewidth) {
            options.strokewidth = imageData.width > 100 ? 6 : 2;
        }
        const drawer = new SvgDrawerGradient(options, '');
        return ImageTracerBrowser.fromImageData(imageData, options, drawer);
    }

    export async function traceBuffer(
        buffer: ArrayBuffer,
        options: Partial<Options> | null = null
    ): Promise<string> {
        options = getOptions(options);
        const drawer = new SvgDrawerGradient(options, '');
        return ImageTracerBrowser.fromBuffer(buffer, options, drawer);
    }

    export function getOptions(options: Partial<Options> | null = null): Options {
        options ??= getTracerOptions()
        return Options.buildFrom(options)
    }

    function getTracerOptions(): Partial<Options> {
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

    /*
    export function traceSvgString(imageData: ImageData): string {
        const options = getTracerOptions();
        options.strokewidth = imageData.width > 100 ? 8 : 2;
        const tracer = new ImageTracerBrowser(options);
        const drawer = new SvgDrawerGradient(options, '');
        return tracer.traceImage(imageData, drawer);
    }*/
}
