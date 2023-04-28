import { callContentApi } from '@/util/content-api-caller'
import { Blacklist } from '../storage/blacklist'
import { IconStorage } from '../storage/icon-storage'
import { SvgColorReplacer } from '../tracer/svg-drawer/svg-color-replacer/svg-color-replacer'
import { Tracer } from '../tracer/tracer'
import { FaviconRequestFilterBase } from './favicon-request-filter-base'


export namespace FaviconRequestFilter {

    export function setRequestFilter(): () => void {
        const config: FaviconRequestFilterBase.Configuration = {
            urlPattern: '*://*/*favicon*',
            requiresHeaderUpdate,
            prepareBeforeRequest

        }
        return FaviconRequestFilterBase.setRequestFilter(config)
    }

    async function requiresHeaderUpdate(details: browser.webRequest._OnHeadersReceivedDetails): Promise<boolean> {
        const [isFavicon, blacklistEntry] = await Promise.all([
            isFaviconUrlInTab(details.tabId, details.url),
            Blacklist.getBlacklistEntry(details.url),
        ] as const)

        const needsUpdate = (details.url.endsWith('/favicon.ico') || isFavicon)
            && (!blacklistEntry || !blacklistEntry.replacementUrl)

        !needsUpdate && !blacklistEntry && console.log('INP- no favicon ' + details.url)

        return needsUpdate
    }

    async function prepareBeforeRequest(iconUrl: string, details: browser.webRequest._OnBeforeRequestDetails): Promise<FaviconRequestFilterBase.RequestFilterHandlers | false> {

        callContentApi('fixupForFilteredUrl', [iconUrl])
        const isFaviconPromise = isFaviconUrlInTab(details.tabId, iconUrl)
        let largestFaviconUrlPromise: Promise<string | undefined> | null = null

        return {
            async onStartWithoutStored(filter) { 
                if (!iconUrl.endsWith('/favicon.ico') && !(await isFaviconPromise)) {
                    console.log('INP- seems to be a regular image, stop filtering', iconUrl)
                    filter.disconnect()
                    return
                }
                largestFaviconUrlPromise = callContentApi('getPageFaviconHref', [], details.tabId)
            },
            async onStopWithoutStored(fullData, closeWithSvg) {
                const [svg, largestFaviconUrl] = await Promise.all([
                    Tracer.traceBuffer(fullData).catch(() => null),
                    largestFaviconUrlPromise,
                ] as const)
    
                if (svg) {
                    const isLargestFavicon = !largestFaviconUrl || iconUrl.includes(largestFaviconUrl)
                    isLargestFavicon && IconStorage.storeIcon(iconUrl, svg)
                    closeWithSvg(svg)
                    return true
                }
    
                try {
                    const updatedSvg = await updateSvgResponse(fullData)
                    IconStorage.storeIcon(iconUrl, updatedSvg)
                    closeWithSvg(updatedSvg)
                    return true
                } catch (e) {}
            },
        }
    }

    async function updateSvgResponse(response: Uint8Array): Promise<string> {
        const svgString = new TextDecoder().decode(response)
        const config = await IconStorage.loadOptions()
        return SvgColorReplacer.replaceColorsInSvg(svgString, config)
    }

    async function isFaviconUrlInTab(tabId: number, url: string): Promise<boolean> {
        if (tabId === -1) {
            return false
        }
        const urlEnd = url.replace(/https?:\/\/[^\/]+\//, '/')
        const [hasLink] = await browser.tabs.executeScript(tabId, {
            code: `
            (function(){
                const link = document.querySelector('link[rel~="icon"][href$="${urlEnd}"]');
                return Boolean(link)
            })()
            `,
            runAt: 'document_start',
        })
        return hasLink
    }
}
