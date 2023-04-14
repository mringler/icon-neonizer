import { Blacklist } from '../storage/blacklist'
import { IconStorage } from '../storage/icon-storage'
import { Tracer } from '../tracer/tracer'

export namespace FaviconRequestFilter {

    export function setRequestFilter() {
        const pattern: browser.webRequest.RequestFilter = {
            urls: ['*://*/favicon.ico'],
            types: ['image'],
        }

        browser.webRequest.onHeadersReceived.addListener(updateHeaderContentType, pattern, [
            'blocking',
            'responseHeaders',
        ])

        browser.webRequest.onBeforeRequest.addListener(replaceIconFilter, pattern, ['blocking'])
    }

    const passFilterRegex = /passFilter=1$/

    async function updateHeaderContentType(
        details: browser.webRequest._OnHeadersReceivedDetails
    ): Promise<browser.webRequest.BlockingResponse> {
        const headers = details.responseHeaders
        if (!headers || passFilterRegex.test(details.url)) {
            return {}
        }

        const isFilteredFavicon = await checkIsFilteredFavicon(details.tabId, details.url)
        if (!isFilteredFavicon) {
            return {}
        }

        setHeader(headers, 'content-type', 'image/svg+xml')
        return { responseHeaders: headers }
    }

    async function checkIsFilteredFavicon(tabId: number, url: string) {
        const [tabHasLink, blacklistEntry] = await Promise.all([
            tabHasIconLink(tabId),
            Blacklist.getBlacklistEntry(url),
        ] as const)
        const isBlacklistedWithoutReplacement = blacklistEntry && !blacklistEntry.replacementUrl
        return !(tabHasLink || isBlacklistedWithoutReplacement)
    }

    function setHeader(headers: browser.webRequest.HttpHeaders, name: string, value: string) {
        const header = headers.find(header => header.name === name)
        if (header) {
            header.value = value
        } else {
            headers.push({ name, value })
        }
    }

    /**
     * Sets a request filter to replace loaded favicon data.
     */
    async function replaceIconFilter(
        details: browser.webRequest._OnBeforeRequestDetails
    ): Promise<browser.webRequest.BlockingResponse> {
        if (passFilterRegex.test(details.url)) {
            return {}
        }

        const [tabHasLink, blacklistEntry] = await Promise.all([
            tabHasIconLink(details.tabId),
            Blacklist.getBlacklistEntry(details.url),
        ] as const)

        if (tabHasLink || (blacklistEntry && ! blacklistEntry.replacementUrl)){
            return {}
        }
        const iconUrl = blacklistEntry?.replacementUrl ?? details.url
        const filter = browser.webRequest.filterResponseData(details.requestId)
        const data: ArrayBuffer[] = []
        const storedIconPromise = IconStorage.loadIcon(iconUrl)

        const closeWithSvg = (svg: string) => {
            const encoder = new TextEncoder()
            filter.write(encoder.encode(svg))
            filter.close()
        }

        /**
         * If image exists in cache, send it and end request.
         */
        filter.onstart = async () => {
            const storedSvg = await storedIconPromise

            if (storedSvg) {
                console.log('INP- replacing request with stored favicon for', iconUrl)
                closeWithSvg(storedSvg)
            }
        }

        filter.onerror = (e: Event) => {
            console.log('INP- loading error', e)
        }

        /**
         * Collect image data.
         */
        filter.ondata = async (event: browser.webRequest._StreamFilterOndataEvent) => {
            data.push(event.data)
        }

        /**
         * Replace received icon data.
         */
        filter.onstop = async (event: Event) => {
            const storedSvg = await storedIconPromise
            const fullData = concatenateArrayBuffer(data)

            if (storedSvg) {
                return // handled in onstart
            }

            const tracedSvg = await Tracer.traceBuffer(fullData).catch(() => null)
            if (tracedSvg) {
                IconStorage.storeIcon(iconUrl, tracedSvg)
                closeWithSvg(tracedSvg)
                return
            }

            filter.write(fullData)
            filter.close()
        }

        return {}
    }

    function concatenateArrayBuffer(buffers: ArrayBuffer[]): Uint8Array {
        const length = buffers.reduce((length, buffer) => length + buffer.byteLength, 0)
        const concatBuffer = new Uint8Array(length)
        let offset = 0
        for (const buffer of buffers) {
            concatBuffer.set(new Uint8Array(buffer), offset)
            offset += buffer.byteLength
        }

        return concatBuffer
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
