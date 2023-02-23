import { initContentApi, replaceFavicon } from "./content-api";
import { Favicon } from "./favicon";

function resolveIconUrl(): [string, boolean] {

    const iconUrl = Favicon.getPageFaviconHref()
    const isInline = iconUrl?.startsWith('data:image') ?? false
    if (iconUrl && !isInline) {
        return [iconUrl, false]
    }
    const url = window.location.host + '/favicon.ico'
    return [url, isInline];
}

(async function () {
    const [iconUrl, isInline] = resolveIconUrl()

    initContentApi(iconUrl);
    replaceFavicon(iconUrl, false, isInline);
})();
