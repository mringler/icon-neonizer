import { initContentApi, replaceFavicon } from "./content-api";
import { Favicon } from "./favicon";

function resolveIconUrl(): [string, boolean] {

    console.log('getting url')
    const iconUrl = Favicon.getPageFaviconUrl()
    if (iconUrl) {
        return [iconUrl, false]
    }
    const url = window.location.host + '/favicon.ico'
    console.log('using', url)
    return [url, true];
}

(async function () {
    //@ts-ignore
    if (window.hasRun) {
        return;
    }
    //@ts-ignore
    //window.hasRun = true;

    //@ts-ignore
    console.clear();
    const [iconUrl, isBackupUrl] = resolveIconUrl()

    initContentApi(iconUrl, !isBackupUrl);

    console.log('got url', iconUrl);
    replaceFavicon(iconUrl, false, !isBackupUrl);

})();
