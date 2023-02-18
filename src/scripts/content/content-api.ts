import type { ApiCaller, ApiMessage, BackgroundApiInterface, ContentApiInterface } from "../ApiInterfaces";
import { Favicon } from "./favicon";


export function initContentApi(iconUrl: string, isBackupUrl: boolean) {

    const contentApi = setupContentApi(iconUrl, isBackupUrl);
    const listener = (
        message: ApiMessage<ContentApiInterface>,
        sender: browser.runtime.MessageSender,
        sendResponse: (response?: any) => void
    ) => {
        const { command, args } = message;
        const handler = contentApi[command]
        if (!handler) {
            return
        }
        const res = handler(...args);
        sendResponse(res);
    };
    browser.runtime.onMessage.addListener(listener);
}

function setupContentApi(iconUrl: string, isBackupUrl:boolean): ContentApiInterface {
    return {
        setIcon: Favicon.setSvg,
        getOriginalFaviconUrl: () => iconUrl,
        verifyHref: (href: string) => verifyHref(href, iconUrl),
    };
}

const callBackgroundApi: ApiCaller<BackgroundApiInterface> = (command, args) => {
    return browser.runtime.sendMessage({ command, args }) as ReturnType<ApiCaller<BackgroundApiInterface>>;
}

export async function replaceFavicon(iconUrl: string, force = false, store = true) {

    const svgString = await callBackgroundApi('processIconUrl', [iconUrl, force, store]);
    if (!svgString) {
        console.log('no icon - not updating');
        return
    }
    Favicon.setSvg(svgString);
}

async function verifyHref(actualHref: string, iconUrl: string){
    const svgString = await callBackgroundApi('processIconUrl', [iconUrl,false, false]);
    const expectedHref = svgString ? Favicon.svgToHref(svgString) : null;
    if(expectedHref && expectedHref === actualHref ){
        return
    }
    Favicon.setSvg(svgString!);
}
