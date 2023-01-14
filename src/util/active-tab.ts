export async function loadActiveTab() {
    return await browser.tabs.getCurrent()
}

export async function loadOpenerTab(): Promise<browser.tabs.Tab | null> {
    const tab = await loadActiveTab()
    const sourceTabId = tab.openerTabId
    if (sourceTabId === undefined) {
        return null
    }
    return browser.tabs.get(sourceTabId)
}