import { RgbColor } from "@image-tracer/core";
import { SvgDrawerGradient } from "./svg-drawer-gradient";

export class SvgDrawerMids extends SvgDrawerGradient{

    protected generateColorPair( color: RgbColor) : [RgbColor, RgbColor]{
        const saturatedColor = this.saturateColor(color);
        const neighborColor = this.findNeighbor(saturatedColor);
        return [saturatedColor, neighborColor]
    }
    protected saturateColor(color: RgbColor): RgbColor
    {
        const {r,g,b} = color;
        const max = Math.max(r,g,b);
        const min = Math.min(r, g, b);

        if(max - min < 40){
            // grayish cannot be saturated
            //const lightenRatio = max < 200 ? 255 / max : 1;
            const grey = RgbColor.fromRgbColorData(color)
            grey.a = 255
            return grey
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
        return new RgbColor(
            update(r),
            update(g),
            update(b)
        )
    }

    protected findNeighbor(color: RgbColor): RgbColor
    {
        const saturatedColor = this.saturateColor(color);
        let {r,g,b} = saturatedColor;
        const max = Math.max(r,g,b)
        const mid = this.mid(r,g,b)
        const min = Math.min(r, g, b)

        if(max - min < 40){
            // grayish, increase equally
            const diff = (max < 120) ? 40 : -40
            return new RgbColor(r + diff, g + diff, b + diff)
        }

        if(min === mid){ // cannot happen mid returns larger
            return new RgbColor(
                (r === max || b === max) ? r : g,
                (g === max || r === max) ? g : b,
                (b === max || g === max) ? b : r,
            )
        }

        const diff = mid < 150 ? 110 : - 110
        if(mid - min > max - mid){
            return new RgbColor(
                (r === max) ? r + diff : r,
                (g === max) ? g + diff : g,
                (b === max) ? b + diff : b,
            )
        }

        return new RgbColor(
            (r === mid) ? r + diff : r,
            (g === mid) ? g + diff : g,
            (b === mid) ? b + diff : b,
        )
    }
}