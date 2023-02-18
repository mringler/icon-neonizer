import type { ApiCaller } from "@/scripts/ApiInterfaces";
import type { ContentApiInterface } from "@/scripts/content/content-api";
import { loadActiveTab } from "./active-tab";

type TabArg = browser.tabs.Tab | null

export async function loadOriginalUrl(tab: TabArg = null): Promise<string> {
    return await callContentApi('getOriginalFaviconUrl', [], tab)
}

export const callContentApi: ApiCaller<ContentApiInterface> = async (command, args, tab: TabArg = null) => {
    tab ??= await loadActiveTab()
    if (tab?.id === undefined) {
        throw new Error('Could not find active tab');
    }
    return browser.tabs.sendMessage(tab.id, { command, args });
}
