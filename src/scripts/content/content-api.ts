import { ApiCaller, ScriptsApi, buildApi} from "../ApiInterfaces";
import type { BackgroundApiInterface } from "../background/background-api";
import { Favicon } from "./favicon";

export type ContentApiInterface = ScriptsApi<ReturnType<typeof buildContentApi>>

function buildContentApi(iconUrl: string) {
    return {
        setIcon: Favicon.setSvg,
        getOriginalFaviconUrl: () => iconUrl,
        verifyHref: (href: string) => verifyHref(href, iconUrl),
        getPageFaviconHref: Favicon.getPageFaviconHref,
        urlIsFavicon: Favicon.urlIsFavicon,
        fixupForFilteredUrl: Favicon.fixupForFilteredUrl
    };
}

export function initContentApi(iconUrl: string) {

    const contentApi = buildContentApi(iconUrl);
    buildApi(contentApi)
}

const callBackgroundApi: ApiCaller<BackgroundApiInterface> = (command, args) => {
    return browser.runtime.sendMessage({ command, args });
}

export async function replaceFavicon(iconUrl: string, force = false, isInline = false) {
    if (!isInline && needsHandling(iconUrl)) {
        return
    }
    const svgString = await callBackgroundApi('processIconUrl', [iconUrl, force]);
    if (!svgString) {
        console.log('no icon - not updating');
        return
    }
    Favicon.setSvg(svgString);
}

async function verifyHref(actualHref: string, iconUrl: string): Promise<void> {
    if (needsHandling(iconUrl)) {
        return
    }
    const svgString = await callBackgroundApi('processIconUrl', [iconUrl, false, false]);
    const expectedHref = svgString ? Favicon.svgToHref(svgString) : null;
    if (expectedHref && expectedHref === actualHref) {
        return
    }
    Favicon.setSvg(svgString!);
}


function needsHandling(iconUrl: string) {
    return iconUrl && Favicon.urlIsHandledByFilter(iconUrl) && !iconUrl.startsWith('data:image')
}
