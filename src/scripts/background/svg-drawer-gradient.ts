import { TraceData, RgbColor, RgbColorData, SvgDrawer } from "@image-tracer/core";

type GradientTags = string[]

export class SvgDrawerGradient extends SvgDrawer{

    protected colorToGradientId = new Map<RgbColor, string>();
    protected gradients: Record<string, GradientTags> = {}

    protected height: number = 48
    protected width: number = 48


    protected addGradient(color: RgbColor): string{
        const id = `my_gradient_${color.r}-${color.g}-${color.b}`
        this.gradients[id] = this.generateGradient(id, color);
        this.colorToGradientId.set(color, id)
        return id
    }

    protected setDimensions(traceData:TraceData){
        this.width = traceData.width
        this.height = traceData.height
    }

    public draw(traceData: TraceData): string {
        this.setDimensions(traceData)
        return super.draw(traceData)
    }

    protected buildSvgTag(traceData: TraceData, tags: string[]): string
    {
        const gradients = Object.values(this.gradients)

        return super.buildSvgTag(traceData, gradients.flat().concat(tags))
    }

    protected colorToRgbString(color: RgbColor): string
    {
        const id = this.colorToGradientId.get(color) ?? this.addGradient(color)

        return `url(#${id})`
    }


    protected generateGradient(id: string, color: RgbColor): GradientTags
    {
        //console.log(color, this.findNeighbour(color))
        const stopColor = super.colorToRgbString(this.findNeighbor(this.saturateColor(color)))
        const startColor = super.colorToRgbString(this.saturateColor(color))

        const x1 = Math.round(Math.random());
        const y1 = Math.round(Math.random());
        const x2 = Math.round(Math.random());
        const y2 = (x1 === x2) ? 1 - y1 : Math.round(Math.random());

        //  gradientTransform="matrix(${x},1,0,${y},2.75,1)"
        return [
            `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">`,
            `  <stop offset="0%" stop-opacity="1" style="stop-color:${startColor}"/>`,
            `  <stop offset="100%" stop-opacity="1" style="stop-color:${stopColor}"/>`,
            `</linearGradient>`
        ];
    }

    protected randomizeColor(color: RgbColor): RgbColorData
    {
        const flux = (val: number, points = 150) => {
            const ratio = Math.floor(Math.random() * points)
            return (val + ratio) % 256 
        }

        return {
            r: flux(color.r),
            g: flux(color.g),
            b: flux(color.b),
            a: color.a
        }
    }

    protected saturateColor(color: RgbColorData): RgbColorData
    {
        const {r,g,b} = color;
        const max = Math.max(r,g,b);
        const min = Math.min(r, g, b);

        if(max - min < 40){
            // grayish cannot be saturated
            //const lightenRatio = max < 200 ? 255 / max : 1;
            return {r, g, b, a: 255}
        }

        // 134-184-24
        const mid = this.mid(r,g,b);
        const update = (c: number) => {
            if( c > mid ) return 255;
            if( c < mid || mid === min) return 0;
            const range = max / 3; 
            if(c < range) return 0;
            return (max -range > mid) ? 128 : 255;
        }
        /*
        console.log(color, {
            r: update(r),
            g: update(g),
            b: update(b),
            a: 255
        })*/
        return {
            r: update(r),
            g: update(g),
            b: update(b),
            a: 255
        }
    }

    protected saturateColor1(color: RgbColor): RgbColorData
    {
        let {r,g,b} = color;

        let max = Math.max(r,g,b)
        if ( max < 120){
            r *= 2
            g *= 2
            b *= 2
            max *=2
        }

        const min = Math.min(r, g, b)
        const mid = this.mid(r,g,b)

        if(max - min < 40){
            // grayish cannot be saturized
            return {r, g, b, a: 255
            }
        }

        if(mid - min > 50){
            // third color muddens
            return {
                r: (r === min) ? 0 : r,
                g: (g === min) ? 0 : g,
                b: (b === min) ? 0 : b,
                a: 255
            }
        }

        return {
            r: (r <= mid) ? Math.floor(r/2) : r,
            g: (g <= mid) ? Math.floor(g/2) : g,
            b: (b <= mid) ? Math.floor(b/2) : b,
            a: 255
        }
    }


    protected findNeighbor2(color: RgbColorData): RgbColorData
    {
        let {r,g,b} = color;
        const max = Math.max(r,g,b)
        const mid = this.mid(r,g,b)
        const min = Math.min(r, g, b)

        if(max - min < 40){
            // grayish, increase equally
            const diff = (max < 120) ? 80 : -80
            return {r: r + diff, g: g + diff, b: b + diff, a: 255}
        }
        const moveBy = 128;
        const diff = (mid < 128) ? moveBy : -moveBy;

        if(max === mid){
            const changeFirst = Math.random() < 0.5;
            return {
                r: (r === min) ? min : (r === max && changeFirst ? max + diff : max),
                g: (g === min) ? min : (r === min === changeFirst ? max + diff : max),
                b: (b === min) ? min : (b === max && !changeFirst ? max + diff : max),
                a: 255
            }
        }

        return {
            r: (r === mid) ? r + diff : r,
            g: (g === mid) ? g + diff : g,
            b: (b === mid) ? b + diff : b,
            a: 255
        }
    }

    protected findNeighbor(color: RgbColorData): RgbColorData
    {
        let {r,g,b} = color;
        const max = Math.max(r,g,b)
        const mid = this.mid(r,g,b)
        const min = Math.min(r, g, b)

        if(max - min < 40){
            // grayish, increase equally
            const diff = (max < 120) ? 40 : -40
            return {r: r + diff, g: g + diff, b: b + diff, a: 255}
        }

        if(min === mid){ // cannot happen mid returns larger
            return {
                r: (r === max || b === max) ? r : g,
                g: (g === max || r === max) ? g : b,
                b: (b === max || g === max) ? b : r,
                a: 255
            }
        }

        const diff = mid < 150 ? 110 : - 110
        if(mid - min > max - mid){
            return {
                r: (r === max) ? r + diff : r,
                g: (g === max) ? g + diff : g,
                b: (b === max) ? b + diff : b,
                a: 255
            }
        }

        return {
            r: (r === mid) ? r + diff : r,
            g: (g === mid) ? g + diff : g,
            b: (b === mid) ? b + diff : b,
            a: 255
        }
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
    protected mid(r:number, g:number, b:number):number {
        if( r < g){
            if(b < r) return r;
            if(g < b) return g;
            return b
        }
        if(b < g) return g;
        if(r < b) return r;
        return b
    }
}