import type { ApiCaller, ApiListener, ScriptsApi } from "../ApiInterfaces";
import type { BackgroundApiInterface } from "../background/background-api";
import { Favicon } from "./favicon";

export type ContentApiInterface = ReturnType<typeof buildContentApi>

function buildContentApi(iconUrl: string) {
    return {
        setIcon: Favicon.setSvg,
        getOriginalFaviconUrl: () => iconUrl,
        verifyHref: (href: string) => verifyHref(href, iconUrl),
    };
}

export function initContentApi(iconUrl: string) {

    const contentApi = buildContentApi(iconUrl);
    const listener: ApiListener<ContentApiInterface> = (message, sender, sendResponse) => {
        const { command, args } = message;
        const handler = contentApi[command]
        const res = (handler as Function)(...args);
        sendResponse(res);
    };
    browser.runtime.onMessage.addListener(listener);
}

const callBackgroundApi: ApiCaller<BackgroundApiInterface> = (command, args) => {
    return browser.runtime.sendMessage({ command, args });
}

export async function replaceFavicon(iconUrl: string, force = false, store = true) {

    const svgString = await callBackgroundApi('processIconUrl', [iconUrl, force, store]);
    if (!svgString) {
        console.log('no icon - not updating');
        return
    }
    Favicon.setSvg(svgString);
}

async function verifyHref(actualHref: string, iconUrl: string): Promise<void>{
    const svgString = await callBackgroundApi('processIconUrl', [iconUrl,false, false]);
    const expectedHref = svgString ? Favicon.svgToHref(svgString) : null;
    if(expectedHref && expectedHref === actualHref ){
        return
    }
    Favicon.setSvg(svgString!);
}
