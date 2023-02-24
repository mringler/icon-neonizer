import type { ApiCaller } from "@/scripts/ApiInterfaces";
import type { ContentApiInterface } from "@/scripts/content/content-api";
import { loadActiveTab } from "./active-tab";

export async function loadOriginalUrl(tabId: number | null = null): Promise<string> {
    return await callContentApi('getOriginalFaviconUrl', [], tabId)
}

export const callContentApi: ApiCaller<ContentApiInterface> = async (command, args, tabId: number | null = null) => {
    if (!tabId) {
        const tab = await loadActiveTab()
        if (tab?.id === undefined) {
            throw new Error('Could not find active tab');
        }
        tabId = tab.id
    }
    return browser.tabs.sendMessage(tabId, { command, args }).catch(() => console.error('Failed to call content api,  command was ', command));
}
