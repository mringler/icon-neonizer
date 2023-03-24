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
        console.log('got headers')
        const headers = details.responseHeaders
        if (!headers || passFilterRegex.test(details.url)) {
            return {}
        }

        const isFilteredFavicon = await checkIsFilteredFavicon(details.tabId, details.url)
        if (!isFilteredFavicon) {
            return {}
        }

        const initialContentType = setHeader(headers, 'content-type', 'image/svg+xml')
        placeOnHeadersReceivedPromise(details.tabId, details.requestId, initialContentType)
        callContentApi('fixupForFilteredUrl', [details.url])
        return { responseHeaders: headers }
    }

    async function checkIsFilteredFavicon(tabId: number, url: string) {
        const [isFaviconInTab, blacklistEntry] = await Promise.all([
            isFaviconUrlInTab(tabId, url),
            Blacklist.getBlacklistEntry(url),
        ] as const)

        const isFavicon = url.endsWith('/favicon.ico') || isFaviconInTab
        const isBlacklistedWithoutReplacement = blacklistEntry && !blacklistEntry.replacementUrl
        return isFavicon && !isBlacklistedWithoutReplacement
    }

    function setHeader(headers: browser.webRequest.HttpHeaders, name: string, value: string) {
        const header = headers.find(header => header.name === name)
        const oldHeaderValue = header?.value
        if (header) {
            header.value = value
        } else {
            headers.push({ name, value })
        }
        return oldHeaderValue
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

        const iconUrl = await getReplacementUrl(details.url)
        if (!iconUrl) {
            return {}
        }

        const filter = browser.webRequest.filterResponseData(details.requestId)
        const data: ArrayBuffer[] = []

        const storedIconPromise = IconStorage.loadIcon(iconUrl)
        const isFaviconPromise = callContentApi('urlIsFavicon', [iconUrl])
        let headersProcessedPromise: Promise<string | false | undefined> | null = null

        const closeWithSvg = (svg: string) => {
            const encoder = new TextEncoder()
            filter.write(encoder.encode(svg))
            filter.close()
        }

        /**
         * If image exists in cache, send it and end request.
         */
        filter.onstart = async () => {
            console.log('onstart -awaiting')
            headersProcessedPromise = awaitOnHeadersReceivedPromise(details.tabId, details.requestId)
            const [isHandledByFilter, storedSvg] = await Promise.all([headersProcessedPromise, storedIconPromise])
            console.log('onstart -awaiting done')

            if (!isHandledByFilter) {
                console.log('INP- no onHeadersReceived event, probably response from service worker - cannot handle in filter', iconUrl)
                return
            }
            if (storedSvg) {
                console.log('INP- replacing request with stored favicon for', iconUrl)
                closeWithSvg(storedSvg)
                return
            }
        }

        filter.onerror = (e: Event) => {
            console.log('INP- loading error', e)
        }

        /**
         * Collect image data.
         */
        filter.ondata = async (event: browser.webRequest._StreamFilterOndataEvent) => {
            console.log('ondata')
            data.push(event.data)
        }

        /**
         * Replace received icon data.
         */
        filter.onstop = async (event: Event) => {
            // make sure storedIconPromise is fulfilled
            const [initialContentType, storedSvg, isFavicon] = await Promise.all([
                headersProcessedPromise,
                storedIconPromise,
                isFaviconPromise
            ])

            const fullData = concatenateArrayBuffer(data)
            if (initialContentType === false || !iconUrl.endsWith('/favicon.ico') && !isFavicon) {
                filter.write(fullData)
                filter.close()
                return
            }

            if (storedSvg) {
                return // handled in onstart
            }

            if (initialContentType === 'image/svg+xml') {
                const updatedSvg = updateSvgResponse(fullData)
                IconStorage.storeIcon(iconUrl, updatedSvg)
                closeWithSvg(updatedSvg)
                return
            }

            const [tracedSvg, largestFaviconUrl] = await Promise.all([
                Tracer.traceBuffer(fullData).catch(() => null),
                callContentApi('getPageFaviconHref', [], details.tabId),
            ])

            if (tracedSvg) {
                const isLargestFavicon = !largestFaviconUrl || iconUrl.includes(largestFaviconUrl)
                isLargestFavicon && IconStorage.storeIcon(iconUrl, tracedSvg)
                closeWithSvg(tracedSvg)
                return
            }

            filter.write(fullData)
            filter.close()
        }

        return {}
    }

    async function getReplacementUrl(iconUrl: string) {
        const blacklistEntry = await Blacklist.getBlacklistEntry(iconUrl)
        if (blacklistEntry?.replacementUrl) {
            return blacklistEntry.replacementUrl
        }
        return blacklistEntry ? null : iconUrl
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

    async function placeOnHeadersReceivedPromise(tabId: number, requestId: string, initialContentType: string | undefined): Promise<void> {
        const promiseName = 'nePromise' + requestId
        await browser.tabs.executeScript(tabId, {
            code: `
            (function(){
                if (window.${promiseName}){
                    console.log('found promise, resolving')
                    window.${promiseName}('${initialContentType}')
                } else {
                    console.log('setting new promise')
                    window.${promiseName} = Promise.resolve('${initialContentType}')
                }
            })()
            `,
            runAt: 'document_start',
        })
    }

    async function awaitOnHeadersReceivedPromise(tabId: number, requestId: string): Promise<string | undefined | false> {
        const promiseName = 'nePromise' + requestId
        const [headersProcessed] = await browser.tabs.executeScript(tabId, {
            code: `
            (async function(){
                let headersProcessed = null
                if(window.${promiseName}){
                    console.log('headers already done')
                    headersProcessed = await window.${promiseName}
                }else{
                    console.log('Setting resolve')
                    headersProcessed = await new Promise(resolve => {
                        console.log('Waiting for headers')
                        const timeoutId = setTimeout(() => resolve(false), 3000)
                        window.${promiseName} = (headerData) => {
                            clearTimeout(timeoutId)
                            resolve(headerData)
                        }
                        
                    })
                }
                console.log('await finished, removing promise', headersProcessed)
                delete window.${promiseName}
                return headersProcessed
            })()
            `,
            runAt: 'document_start',
        })
        console.log('headersProcessed', headersProcessed)
        return headersProcessed
    }
}