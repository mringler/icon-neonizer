export namespace SvgToPng {
    export function convert(rawSvgString: string, widthPx: number): Promise<string> {
        return new Promise(resolve => {
            const image = new Image(widthPx, widthPx)
            image.onload = function () {
                const canvas = document.createElement('canvas')
                canvas.width = image.width
                canvas.height = image.height
                canvas.getContext('2d')!.drawImage(image, 0, 0, image.width, image.height)
                resolve(canvas.toDataURL())
                canvas.remove()
                image.remove()
            }
            const svgString = addDimensionsToSvgString(rawSvgString, widthPx)
            image.src = 'data:image/svg+xml,' + encodeURIComponent(svgString)
        })
    }

    function addDimensionsToSvgString(svgString: string, widthPx: number){
        return svgString.replace('<svg', `<svg width="${widthPx}" height="${widthPx}"`)
    }

    export async function convertInTab(tabId: number, svgString: string, widthPx: number): Promise<string> {
        if (tabId === -1) {
            throw new Error('Invalid tabId: -1 - cannot convert image')
        }
        const fun = convert.toString()
        console.log('converting', fun)
        const [png] = await browser.tabs.executeScript(tabId, {
            code: `
            (async function(){
                const svgString = \`${svgString}\`
                ${fun}
                const png = await convert(svgString, ${widthPx})
                return png
            })()
            `,
            runAt: 'document_start',
        })
        return png
    }
}
