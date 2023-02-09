export async function loadActiveTab() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    return tabs.length > 0 ? tabs[0] : null;
}

export async function loadCurrentTab() {
    return await browser.tabs.getCurrent()
}
export async function loadOpenerTab(): Promise<browser.tabs.Tab | null> {
    const tab = await loadCurrentTab()
    const sourceTabId = tab?.openerTabId
    if (sourceTabId === undefined) {
        console.error('could not get source tab id')
        return null
    }
    return browser.tabs.get(sourceTabId)
}