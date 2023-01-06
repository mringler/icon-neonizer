import type { ContentApiInterface, ApiCaller } from "@/scripts/ApiInterfaces";
import { loadActiveTab } from "./active-tab";

type TabArg = browser.tabs.Tab | null

export async function loadOriginalUrl(tab: TabArg = null): Promise<string> {
    return await callContentApi('getOriginalFaviconUrl', [], tab)
}

export const callContentApi: ApiCaller<ContentApiInterface> = async (
    command,
    args,
    tab: TabArg = null
) => {
    if(!tab){
        tab = await loadActiveTab()
    }
    if (!tab || tab.id === undefined) {
        throw new Error('Could not find active tab');
    }
    return browser.tabs.sendMessage(tab.id, { command, args }) as ReturnType<ApiCaller<ContentApiInterface>>;
}