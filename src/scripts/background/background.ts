import { callContentApi } from "../../util/content-api";
import { initBackgroundApi } from "./background-api";
import { FaviconRequestFilter } from "./request-filter/favicon-request-filter";
import { IconStorage } from "./storage/icon-storage";
import { TouchIconRequestFilter } from "./request-filter/touch-icon-request-filter.";

FaviconRequestFilter.setRequestFilter();
TouchIconRequestFilter.setRequestFilter();

initBackgroundApi();

browser.tabs.onUpdated.addListener(
    (tabId, changeInfo, tab) => callContentApi('verifyHref', [changeInfo.favIconUrl!], tab.id), 
    {properties:['favIconUrl']}
)

setTimeout(() => IconStorage.cleanup(), 60_000)
