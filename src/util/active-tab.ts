export async function loadActiveTab() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });

    return tabs.length > 0 ? tabs[0] : null;
}