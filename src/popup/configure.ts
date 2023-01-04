import type { ContentApiInterface, ApiCaller, BackgroundApiInterface } from "@/core/ApiInterfaces";

const callContentApi: ApiCaller<ContentApiInterface> = async (command, args) => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tabs || tabs[0].id === undefined) {
        throw new Error('Could not find active tab');
    }
    return browser.tabs.sendMessage(tabs[0].id, { command, args }) as ReturnType<ApiCaller<ContentApiInterface>>;;
}

const callBackgroundApi: ApiCaller<BackgroundApiInterface> = (command, args) => {
    return browser.runtime.sendMessage({ command, args }) as ReturnType<ApiCaller<BackgroundApiInterface>>;
}

const elementActions: { [key: string]: () => any } = {
    clearStorage: () => browser.storage.local.clear(),
    recreateImage: () => callContentApi('rebuildIcon', []).then(getIcons),
    logIcon: () => callContentApi('logFavicon', []),
    viewIcon: () => callContentApi('getOriginalFaviconUrl', []),
    requestIcons: () => getIcons(),
}

Object.entries(elementActions).forEach(([id, callback]) => document.getElementById(id)!.onclick = callback);

async function getIcons() {
    const [originalUrl, favicon] = await Promise.all([
        callContentApi('getOriginalFaviconUrl', []),
        callContentApi('getCurrentFaviconData', []),
    ])
    setIcons(originalUrl, favicon)
}

async function loadActiveTab() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });

    return tabs.length > 0 ? tabs[0] : null;
}

async function setIcons(originalUrl: string, newIcon: string | null) {
    const originalImg = document.getElementById('originalIcon') as HTMLImageElement
    originalImg.src = originalUrl

    if (!newIcon) {
        const tab = await loadActiveTab();
        newIcon = tab?.favIconUrl ?? ''
        console.log('will use', newIcon)
    }
    const neonImg = document.getElementById('neonIcon') as HTMLImageElement
    console.log(neonImg, newIcon)
    neonImg.src = newIcon
}

getIcons();