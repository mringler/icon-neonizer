import { Blacklist } from '../storage/blacklist'
import { IconStorage } from '../storage/icon-storage'
import { Tracer } from '../tracer/tracer'
import { FaviconRequestFilterBase } from './favicon-request-filter-base'



export namespace FallbackFaviconRequestFilter {

    export function setRequestFilter() {
        const config: FaviconRequestFilterBase.Configuration = {
            urlPattern: '*://*/favicon.ico',
            requiresHeaderUpdate,
            prepareBeforeRequest

        }
        return FaviconRequestFilterBase.setRequestFilter(config)
    }

    async function requiresHeaderUpdate(details: browser.webRequest._OnHeadersReceivedDetails): Promise<boolean> {
        const { tabId, url } = details
        const [tabHasLink, blacklistEntry] = await Promise.all([
            tabHasIconLink(tabId),
            Blacklist.getBlacklistEntry(url),
        ] as const)
        const isBlacklistedWithoutReplacement = blacklistEntry && !blacklistEntry.replacementUrl
        return !(tabHasLink || isBlacklistedWithoutReplacement)
    }

    async function prepareBeforeRequest(iconUrl: string, details: browser.webRequest._OnBeforeRequestDetails): Promise<FaviconRequestFilterBase.RequestFilterHandlers | false> {
        const [tabHasLink, blacklistEntry] = await Promise.all([
            tabHasIconLink(details.tabId),
            Blacklist.getBlacklistEntry(details.url),
        ] as const)

        if (tabHasLink || (blacklistEntry && !blacklistEntry.replacementUrl)) {
            return false
        }

        return {
            onStartWithoutStored: () => { },
            async onStopWithoutStored(fullData, closeWithSvg) {
                const tracedSvg = await Tracer.traceBuffer(fullData).catch(() => null)
                if (tracedSvg) {
                    IconStorage.storeIcon(iconUrl, tracedSvg)
                    closeWithSvg(tracedSvg)
                    return true
                }
            },
        }
    }

    async function tabHasIconLink(tabId: number): Promise<boolean> {
        const [hasLink] = await browser.tabs.executeScript(tabId, {
            code: `
            (function(){
                const link = document.querySelector('link[rel~="icon"]');
                return Boolean(link)
            })()
            `,
            runAt: 'document_start',
        })
        return hasLink
    }
}
