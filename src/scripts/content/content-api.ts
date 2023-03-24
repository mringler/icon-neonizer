import { ApiCaller, ScriptsApi, buildApi } from '../ApiInterfaces'
import type { BackgroundApiInterface } from '../background/background-api'
import { Favicon } from './favicon'

export type ContentApiInterface = ScriptsApi<ReturnType<typeof buildContentApi>>

function buildContentApi(iconUrl: string) {
    return {
        setIcon: Favicon.setSvg,
        getOriginalFaviconUrl: () => iconUrl,
        verifyHref: (href: string) => verifyHref(href, iconUrl),
        getPageFaviconHref: Favicon.getPageFaviconHref,
        urlIsFavicon: Favicon.urlIsFavicon,
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

    const svgString = await loader
    if (!svgString) {
        console.log('no icon - not updating')
        return
    }
    Favicon.setSvg(svgString)
}

async function verifyHref(actualHref: string, iconUrl: string): Promise<void> {
    console.log('ne- verifyHref')
    if (isHandledByFilter(iconUrl)) {
        return
    }
    const svgString = await callBackgroundApi('processIconUrl', [iconUrl, false, false])
    const expectedHref = svgString ? Favicon.svgToHref(svgString) : null
    if (expectedHref && expectedHref === actualHref) {
        return
    }
    console.log('ne- Found wrong favicon, restoring')
    Favicon.setSvg(svgString!)
}

function isHandledByFilter(iconUrl: string) {
    return iconUrl && Favicon.urlIsHandledByFilter()
}
