import { initContentApi, replaceFavicon } from "./content-api";
import { Favicon } from "./favicon";

function resolveIconUrl(): [string, boolean] {

    const iconUrl = Favicon.getPageFaviconUrl()
    if (iconUrl) {
        return [iconUrl, false]
    }
    const url = window.location.host + '/favicon.ico'
    return [url, true];
}

(async function () {
    const [iconUrl, isBackupUrl] = resolveIconUrl()

    initContentApi(iconUrl);
    replaceFavicon(iconUrl, false, !isBackupUrl);
})();
