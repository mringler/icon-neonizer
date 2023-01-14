import type { ApiMessage, BackgroundApiInterface } from "../ApiInterfaces";
import { Blacklist } from "./blacklist";
import { IconStorage } from "./icon-storage";
import { Tracer } from "./tracer";

const backgroundApi: BackgroundApiInterface = {
    processIconUrl,
    getStoredIcon: IconStorage.loadIcon,
    storeIcon: IconStorage.storeIcon,
    getStoredIcons: IconStorage.loadAll,
    removeIcon: IconStorage.removeIcon,
    getOptions: Tracer.getOptions,
    traceWithOptions: Tracer.traceUrl
}

async function processIconUrl(iconUrl: string, force = false, store = true): Promise<string|null> {

    const blacklistEntry = await Blacklist.getBlacklistEntry(iconUrl)
    if(blacklistEntry?.replacementUrl){
        iconUrl = blacklistEntry.replacementUrl
    }
    let icon = await IconStorage.loadIcon(iconUrl);
    if (icon && !force) {
        return icon;
    }

    if(blacklistEntry){
        return null
    }

    try{
        icon = await Tracer.traceUrl(iconUrl);
    }catch(e){
        console.log(e)
        return null
    }
        store && IconStorage.storeIcon(iconUrl, icon);
    return icon;
}

export async function initBackgroundApi() {

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