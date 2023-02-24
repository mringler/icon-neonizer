import { ScriptsApi, buildApi } from "../ApiInterfaces";
import { Blacklist } from "./storage/blacklist";
import { IconStorage } from "./storage/icon-storage";
import { Tracer } from "./tracer/tracer";


const backgroundApi = {
    processIconUrl,
    getStoredIcon: IconStorage.loadIcon,
    storeIcon: IconStorage.storeIcon,
    getStoredIcons: IconStorage.loadAll,
    removeIcon: IconStorage.removeIcon,
    getOptions: Tracer.getOptions,
    traceWithOptions: Tracer.traceUrl
}

export type BackgroundApiInterface = ScriptsApi<typeof backgroundApi>;

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
    buildApi(backgroundApi)
}