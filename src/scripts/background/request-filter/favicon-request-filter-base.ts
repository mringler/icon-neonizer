import { Blacklist } from '../storage/blacklist'
import { IconStorage } from '../storage/icon-storage'

export namespace FaviconRequestFilterBase {

    export type Configuration = {
        urlPattern: string
        requiresHeaderUpdate(details: browser.webRequest._OnHeadersReceivedDetails): Promise<boolean>
        prepareBeforeRequest: (iconUrl: string, details: browser.webRequest._OnBeforeRequestDetails) => Promise<RequestFilterHandlers | false>,
    }

    export type RequestFilterHandlers = {
        onStartWithoutStored: (filter: browser.webRequest.StreamFilter) => false | any,
        onStopWithoutStored: (fullData: Uint8Array, closeWithSvg: (svg: string) => any) => Promise<false | any>
    }

    export function setRequestFilter(configuration: Configuration) {
        const pattern: browser.webRequest.RequestFilter = {
            urls: [configuration.urlPattern],
            types: ['image'],
        }

        const onHeadersReceivedCallback = buildOnHeadersReceivedCallback(configuration)
        browser.webRequest.onHeadersReceived.addListener(onHeadersReceivedCallback, pattern, [
            'blocking',
            'responseHeaders',
        ])

        const onBeforeRequestCallback = buildOnBeforeRequestCallback(configuration)
        browser.webRequest.onBeforeRequest.addListener(onBeforeRequestCallback, pattern, ['blocking'])
    }

    const passFilterRegex = /passFilter=1$/

    function buildOnHeadersReceivedCallback(configuration: Configuration) {
        return async function updateHeaderContentType(
            details: browser.webRequest._OnHeadersReceivedDetails
        ): Promise<browser.webRequest.BlockingResponse> {
            const headers = details.responseHeaders
            if (!headers || passFilterRegex.test(details.url)) {
                console.log('IINP - headers -abborti')
                return {}
            }

            const needsUpdate = await configuration.requiresHeaderUpdate(details)
            console.log('IINP - updating in header: ', needsUpdate)
            if (!needsUpdate) {
                return {}
            }

            setHeader(headers, 'content-type', 'image/svg+xml')
            return { responseHeaders: headers }
        }
    }

    function setHeader(headers: browser.webRequest.HttpHeaders, name: string, value: string) {
        const header = headers.find(header => header.name === name)
        if (header) {
            header.value = value
        } else {
            headers.push({ name, value })
        }
    }


    async function resolveIconUrl(initialUrl: string) {
        const blacklistEntry = await Blacklist.getBlacklistEntry(initialUrl)
        return blacklistEntry ? blacklistEntry.replacementUrl : initialUrl
    }

    function buildOnBeforeRequestCallback(configuration: Configuration) {
        return async function replaceIconFilter(
            details: browser.webRequest._OnBeforeRequestDetails
        ): Promise<browser.webRequest.BlockingResponse> {
            if (passFilterRegex.test(details.url)) {
                return {}
            }
            const iconUrl = await resolveIconUrl(details.url)
            if (!iconUrl) {
                return {};
            }
            const filter = browser.webRequest.filterResponseData(details.requestId)
            const data: ArrayBuffer[] = []
            const storedIconPromise = IconStorage.loadIcon(iconUrl)

            const handlers = await configuration.prepareBeforeRequest(iconUrl, details)
            if (!handlers){
                return {}
            }

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
                handlers.onStartWithoutStored(filter)
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
                // make sure storedIconPromise is fulfilled
                const storedSvg = await storedIconPromise
                if (storedSvg) {
                    return // handled in onstart
                }
                const fullData = concatenateArrayBuffer(data)
                const isHandled = await handlers.onStopWithoutStored(fullData, closeWithSvg)
                if (isHandled){
                    return
                }

                filter.write(fullData)
                filter.close()
            }

            return {}
        }
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
}
