import type { ApiMessage, BackgroundApiInterface } from "../core/ApiInterfaces";
import { IconStorage } from "./icon-storage";
import { Tracer } from "./tracer";

const backgroundApi: BackgroundApiInterface = {
    processIconUrl,
    getStoredIcon: IconStorage.loadIcon,
    storeIcon: IconStorage.storeIcon
}

async function processIconUrl(iconUrl: string, force = false): Promise<string|null> {
    let icon = await IconStorage.loadIcon(iconUrl);
    if (icon && !force) {
        return icon;
    }

    icon = await Tracer.traceUrl(iconUrl);
    IconStorage.storeIcon(iconUrl, icon);
    return icon;
}

export function initBackgroundApi() {

    browser.runtime.onMessage.addListener((
        message: ApiMessage<BackgroundApiInterface>,
        sender: browser.runtime.MessageSender,
        sendResponse: (response?: any) => void
    ) => {
        const {command, args} = message;
        const handler = backgroundApi[command]
        if(!handler){
            return
        }
        const res = handler(...args);
        sendResponse(res);
    });
}