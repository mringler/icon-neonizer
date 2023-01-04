import type { ApiCaller, ApiMessage, BackgroundApiInterface, ContentApiInterface } from "@/core/ApiInterfaces";
import { Favicon } from "./favicon";


export function initContentApi(iconUrl: string) {

    const contentApi = setupContentApi(iconUrl);
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

function setupContentApi(iconUrl: string): ContentApiInterface {
    return {
        log: (...args: any[]) => console.log(...args),
        setIcon: Favicon.setSvg,
        logFavicon: () => console.log(Favicon.getCurrentFavicon()),
        getOriginalFaviconUrl: () => iconUrl,
        getCurrentFavicon: Favicon.getCurrentFavicon,
        getCurrentFaviconData: Favicon.getCurrentFaviconData,
        rebuildIcon: () => replaceFaviconUrl(iconUrl, true),
    };
}

const callBackgroundApi: ApiCaller<BackgroundApiInterface> = (command, args) => {
    return browser.runtime.sendMessage({ command, args }) as ReturnType<ApiCaller<BackgroundApiInterface>>;
}

export async function replaceFaviconUrl(iconUrl: string, force = false) {

    const icon = await callBackgroundApi('processIconUrl', [iconUrl, force]);
    if (!icon) {
        console.log('no icon - not updating');
        return
    }
    Favicon.setSvg(icon);
    console.log('updated icon');
}
