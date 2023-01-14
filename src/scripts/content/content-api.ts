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
        log: (...args: any[]) => console.log(...args),
        setIcon: Favicon.setSvg,
        logFavicon: () => console.log(Favicon.getCurrentFavicon()),
        getOriginalFaviconUrl: () => iconUrl,
        getCurrentFavicon: Favicon.getCurrentFavicon,
        getCurrentFaviconData: Favicon.getCurrentFaviconData,
        rebuildIcon: () => replaceFavicon(iconUrl, true, !isBackupUrl),
    };
}

const callBackgroundApi: ApiCaller<BackgroundApiInterface> = (command, args) => {
    return browser.runtime.sendMessage({ command, args }) as ReturnType<ApiCaller<BackgroundApiInterface>>;
}

export async function replaceFavicon(iconUrl: string, force = false, store = true) {

    const icon = await callBackgroundApi('processIconUrl', [iconUrl, force, store]);
    if (!icon) {
        console.log('no icon - not updating');
        return
    }
    Favicon.setSvg(icon);
    console.log('updated icon');
}
