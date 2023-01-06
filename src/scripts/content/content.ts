import { initContentApi, replaceFaviconUrl } from "./content-api";
import { Favicon } from "./favicon";


(async function () {
    //@ts-ignore
    if (window.hasRun) {
        return;
    }
    //@ts-ignore
    window.hasRun = true;

    //@ts-ignore
    console.clear();

    const iconUrl = Favicon.getPageFaviconUrl();
    initContentApi(iconUrl);

    console.log('got url', iconUrl);
    replaceFaviconUrl(iconUrl);

})();
