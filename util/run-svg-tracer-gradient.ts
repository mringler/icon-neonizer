import {
    FillStyle, TrimMode, InterpolationMode, OutputFormat,
    CreatePaletteMode, LayeringMode, ImageTracerNodejsOptions, ImageTracerNodejs
} from '@image-tracer/nodejs';

import {SvgDrawerGradient} from '../src/background/svg-drawer-gradient';

const defaultOptions = {
    scale: 1,
    colorsampling: CreatePaletteMode.SCAN,
    numberofcolors: 32,
    linefilter: false,
    layering: LayeringMode.SEQUENTIAL,
    strokewidth: 1,
    desc: true,
    fillstyle: FillStyle.FILL,
    pathomit: 8,
    colorquantcycles: 3,
    decimalPlaces: 1,
    ltres: 1,
    qtres: 1,
    segmentEndpointRadius: 0,
    curveControlPointRadius: 0,
    trim: TrimMode.ALL,
    interpolationMode: InterpolationMode.INTERPOLATE,
    verbose: true,
    outputName: 'traced',
    output: [OutputFormat.PNG, OutputFormat.SVG],
};

(async function(){
    const [fileName, options] = await ImageTracerNodejsOptions.fromArgs();
    Object.assign(options, defaultOptions, options);
    const drawer = new SvgDrawerGradient(options, '');
    ImageTracerNodejs.fromFileName(fileName, options, drawer);
})();