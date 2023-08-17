import { SvgToPng } from '@/util/svg-to-png'
import { type ApiCaller, type ScriptsApi, buildApi } from '../ApiInterfaces'
import type { BackgroundApiInterface } from '../background/background-api'
import { Favicon } from './favicon'

export type ContentApiInterface = ScriptsApi<ReturnType<typeof buildContentApi>>

function buildContentApi(iconUrl: string) {
    return {
        setIcon: Favicon.setImage,
        getOriginalFaviconUrl: () => iconUrl,
        verifyHref: (href: string) => verifyHref(href, iconUrl),
        getPageFaviconHref: Favicon.getPageFaviconHref,
        fixupForFilteredUrl: Favicon.fixupForFilteredUrl,
    }
}

export function initContentApi(iconUrl: string) {
    const contentApi = buildContentApi(iconUrl)
    buildApi(contentApi)
}

const callBackgroundApi: ApiCaller<BackgroundApiInterface> = (command, args) => {
    return browser.runtime.sendMessage({ command, args })
}

export async function replaceFavicon(iconUrl: string, force = false, inlineData?: string) {
    if (isHandledByFilter(iconUrl) || Favicon.urlIsReplaced()) {
        return
    }
    const loader = inlineData
        ? callBackgroundApi('processInlineData', [inlineData, iconUrl, force])
        : callBackgroundApi('processIconUrl', [iconUrl, force])

    const [imageString, isPng] = await loadImageString(loader)
    console.log(imageString, isPng)
    if (!imageString) {
        console.log('no icon - not updating')
        return
    }
    
    Favicon.setImage(imageString, !isPng)
}

async function verifyHref(actualHref: string, iconUrl: string): Promise<void> {
    console.log('ne- verifyHref')
    if (isHandledByFilter(iconUrl)) {
        return
    }
    const loader = callBackgroundApi('processIconUrl', [iconUrl, false, false])
    const [imageString, isPng] = await loadImageString(loader)
    const expectedHref = imageString && !isPng ? Favicon.svgToHref(imageString) : imageString
    if (expectedHref && expectedHref === actualHref) {
        return
    }
    console.log('ne- Found wrong favicon, restoring')
    Favicon.setImage(imageString!, !isPng)
}

async function loadImageString(loader: Promise<string|null>): Promise<[string|null, boolean]>{
    const [svgString, pngWidth] = await Promise.all([loader, callBackgroundApi('getPngWidthSetting', [])])
    const usePng = Boolean(pngWidth)
    return [
        usePng && svgString ? await SvgToPng.convert(svgString, pngWidth!) : svgString,
        usePng
    ]
}

function isHandledByFilter(iconUrl: string) {
    return iconUrl && Favicon.urlIsHandledByFilter()
}
