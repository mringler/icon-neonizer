import { Blacklist } from "./blacklist";
import { IconStorage } from "./icon-storage";

export namespace TouchIconRequestFilter {

    export function setRequestFilter() {
        const pattern: browser.webRequest.RequestFilter = { urls: ['*://*/*apple-touch*'], types: ['image'] }

        browser.webRequest.onHeadersReceived.addListener(
            updateHeaderContentType,
            pattern,
            ["blocking", "responseHeaders"]
        );

        browser.webRequest.onBeforeRequest.addListener(
            replaceIconFilter,
            pattern,
            ["blocking"]
        );
    }

    async function getFaviconUrl(tabId: number): Promise<string|undefined>{
        const tab = await browser.tabs.get(tabId)
        return tab.favIconUrl
    }

    async function updateHeaderContentType(headerDetails: browser.webRequest._OnHeadersReceivedDetails): Promise<browser.webRequest.BlockingResponse> {

        const headers = headerDetails.responseHeaders
        if (!headers) {
            return {}
        }

        const faviconUrl = await isTouchIconUrlInTab(headerDetails.tabId, headerDetails.url)
        const storedIcon = faviconUrl && await IconStorage.loadIcon(faviconUrl);
        if (!storedIcon) {
            console.log('AT - no icon for', headerDetails.url, faviconUrl, storedIcon)
            return {}
        }
        console.log('AT - replacing with', faviconUrl)

        const contentType = headers.find(header => header.name === 'content-type');
        if (contentType) {
            contentType.value = 'image/svg+xml'
        } else {
            headers.push({ name: 'content-type', value: 'image/svg+xml' });
        }
        return { responseHeaders: headers };
    }



    async function replaceIconFilter(requestDetails: browser.webRequest._OnBeforeRequestDetails): Promise<browser.webRequest.BlockingResponse> {

        let faviconUrl = await isTouchIconUrlInTab(requestDetails.tabId, requestDetails.url)
        if(!faviconUrl){
            return {}
        }

        const blacklistEntry = await Blacklist.getBlacklistEntry(faviconUrl)
        if (blacklistEntry?.replacementUrl) {
            faviconUrl = blacklistEntry.replacementUrl
        }

        const filter = browser.webRequest.filterResponseData(requestDetails.requestId);
        const storedIconPromise = IconStorage.loadIcon(faviconUrl);

        const writeSvg = (svg: string) => {
            const encoder = new TextEncoder();
            filter.write(encoder.encode(svg));
        }

        filter.onstart = async () => {
            const svg = await storedIconPromise

            if (!svg) {
                filter.disconnect()
                return
            }
            writeSvg(svg);
            filter.close();
        }
        return {};
    }

    async function isTouchIconUrlInTab(tabId: number, url: string): Promise<string | null> {
        const urlEnd = url.replace(/https?:\/\/[^\/]+\//, '/')
        const [hasLink] = await browser.tabs.executeScript(tabId, {
            code: `
            (function(){
                const touchIconLink = document.querySelector('link[rel~="apple-touch-icon"][href$="${urlEnd}"]');
                if(!touchIconLink){
                    return null
                }
                touchIconLink.type = 'image/svg+xml';
                const faviconLinks = document.querySelectorAll('link[rel~="icon"]');
                return faviconLinks[0]?.href ?? null
            })()
            `,
            runAt: 'document_start',
        })
        return hasLink
    }

}
