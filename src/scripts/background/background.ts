import { callContentApi } from "@/util/content-api";
import { initBackgroundApi } from "./background-api";
import { FaviconRequestFilter } from "./favicon-request-filter";
import { IconStorage } from "./icon-storage";

FaviconRequestFilter.setRequestFilter();
initBackgroundApi();

browser.tabs.onUpdated.addListener(
    (tabId, changeInfo, tab) => callContentApi('verifyHref', [changeInfo.favIconUrl!], tab), 
    {properties:['favIconUrl']}
)
setTimeout(() => IconStorage.cleanup(), 60_000)