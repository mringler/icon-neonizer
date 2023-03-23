import { callContentApi } from '@/util/content-api-caller'
import { Blacklist } from '../storage/blacklist'
import { IconStorage } from '../storage/icon-storage'
import { SvgColorReplacer } from '../tracer/svg-color-replacer'
import { Tracer } from '../tracer/tracer'

export namespace FaviconRequestFilter {
    export function setRequestFilter() {
        const pattern: browser.webRequest.RequestFilter = {
            urls: ['*://*/*favicon*'],
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

        const [isFavicon, blacklistEntry] = await Promise.all([
            isFaviconUrlInTab(details.tabId, details.url),
            Blacklist.getBlacklistEntry(details.url),
        ] as const)

        if (
            (!details.url.endsWith('/favicon.ico') && !isFavicon) ||
            (blacklistEntry && !blacklistEntry.replacementUrl)
        ) {
            !blacklistEntry && console.log('INP- no favicon ' + details.url)
            return {}
        }

        const contentType = headers.find((header) => header.name === 'content-type')
        if (contentType) {
            contentType.value = 'image/svg+xml'
        } else {
            headers.push({ name: 'content-type', value: 'image/svg+xml' })
        }
        return { responseHeaders: headers }
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

        let iconUrl = details.url
        const blacklistEntry = await Blacklist.getBlacklistEntry(iconUrl)
        if (blacklistEntry?.replacementUrl) {
            iconUrl = blacklistEntry.replacementUrl
        }
        callContentApi('fixupForFilteredUrl', [iconUrl])

        const filter = browser.webRequest.filterResponseData(details.requestId)
        const data: ArrayBuffer[] = []

        const storedIconPromise = IconStorage.loadIcon(iconUrl)
        const isFaviconPromise = callContentApi('urlIsFavicon', [iconUrl])
        let largestFaviconUrlPromise: Promise<string | undefined> | null = null

        const closeWithSvg = (svg: string) => {
            const encoder = new TextEncoder()
            filter.write(encoder.encode(svg))
            filter.close()
        }

        /**
         * If image exists in cache, send it and end request.
         */
        filter.onstart = async () => {
            const svg = await storedIconPromise
            if (svg) {
                console.log('INP- replacing request with stored favicon for', iconUrl)
                closeWithSvg(svg)
                return
            }

            if (!iconUrl.endsWith('/favicon.ico') && !(await isFaviconPromise)) {
                console.log('INP- seems to be a regular image, stop filtering', iconUrl)
                filter.disconnect()
                return
            }
            largestFaviconUrlPromise = callContentApi('getPageFaviconHref', [], details.tabId)
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
            // make sure storedIconPromise is fulfilled
            const storedSvg = await storedIconPromise
            if (storedSvg) {
                return
            }
            const fullData = concatenateArrayBuffer(data)

            const [svg, largestFaviconUrl] = await Promise.all([
                Tracer.traceBuffer(fullData).catch(() => null),
                largestFaviconUrlPromise,
            ] as const)

            if (svg) {
                const isLargestFavicon = !largestFaviconUrl || iconUrl.includes(largestFaviconUrl)
                isLargestFavicon && IconStorage.storeIcon(iconUrl, svg)
                closeWithSvg(svg)
                return
            }

            try {
                const updatedSvg = updateSvgResponse(fullData)
                IconStorage.storeIcon(iconUrl, updatedSvg)
                closeWithSvg(updatedSvg)
                return
            } catch (e) {}

            filter.write(fullData)
            filter.close()
        }

        return {}
    }

    function updateSvgResponse(response: Uint8Array): string {
        const svgString = new TextDecoder().decode(response)
        return SvgColorReplacer.replaceColorsInSvg(svgString)
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

    async function isFaviconUrlInTab(tabId: number, url: string): Promise<boolean> {
        const urlEnd = url.replace(/https?:\/\/[^\/]+\//, '/')
        const [hasLink] = await browser.tabs.executeScript(tabId, {
            code: `
            (function(){
                const links = document.querySelectorAll('link[rel~="icon"][href$="${urlEnd}"]');
                return Boolean(links.length)
            })()
            `,
            runAt: 'document_start',
        })
        return hasLink
    }
}
