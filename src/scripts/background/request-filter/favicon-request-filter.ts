import { callContentApi } from "@/util/content-api";
import { Blacklist } from "../storage/blacklist";
import { IconStorage } from "../storage/icon-storage";
import { Tracer } from "../tracer/tracer";

export namespace FaviconRequestFilter {

    export function setRequestFilter() {
        const pattern: browser.webRequest.RequestFilter = { urls: ['*://*/*favicon*'], types: ['image'] }

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

    const passFilterRegex = /passFilter=1$/

    async function updateHeaderContentType(details: browser.webRequest._OnHeadersReceivedDetails): Promise<browser.webRequest.BlockingResponse> {

        const headers = details.responseHeaders
        if (!headers) {
            return {}
        }

        if (passFilterRegex.test(details.url)){
            return {}
        }

        const [isFavicon, blacklistEntry] = await Promise.all([
            isFaviconUrlInTab(details.tabId, details.url), 
            Blacklist.getBlacklistEntry(details.url)
        ] as const)

        if ((!details.url.endsWith('/favicon.ico') && !isFavicon) || (blacklistEntry && !blacklistEntry.replacementUrl)) {
            console.log('no favicon or blacklisted')
            return {}
        }

        const contentType = headers.find(header => header.name === 'content-type');
        if (contentType) {
            contentType.value = 'image/svg+xml'
        } else {
            headers.push({ name: 'content-type', value: 'image/svg+xml' });
        }
        return { responseHeaders: headers };
    }

    async function replaceIconFilter(details: browser.webRequest._OnBeforeRequestDetails): Promise<browser.webRequest.BlockingResponse> {
        if (passFilterRegex.test(details.url)) {
            return {}
        }

        let iconUrl = details.url;
        const blacklistEntry = await Blacklist.getBlacklistEntry(iconUrl)
        if(blacklistEntry?.replacementUrl) {
            iconUrl = blacklistEntry.replacementUrl
        }
        callContentApi('fixupForFilteredUrl', [iconUrl])

        const filter = browser.webRequest.filterResponseData(details.requestId);
        const data: ArrayBuffer[] = [];

        const storedIconPromise = IconStorage.loadIcon(iconUrl);
        const isFaviconPromise = callContentApi('urlIsFavicon', [iconUrl])
        let largestFaviconUrlPromise:Promise<string|null>|null = null

        const writeSvg = (svg: string) => {
            const encoder = new TextEncoder();
            filter.write(encoder.encode(svg));
        }


        /**
         * If image exists in cache, send it and end request.
         */
        filter.onstart = async () => {
            const [svg, isFavicon] = await Promise.all([storedIconPromise, isFaviconPromise] as const);

            if (!svg) {
                if(!iconUrl.endsWith('/favicon.ico') && !isFavicon ){
                    console.log('INP- seems to be a regular image, stop filtering', iconUrl)
                    filter.disconnect()
                }
                largestFaviconUrlPromise = callContentApi('getPageFaviconHref', [], details.tabId)
                return
            }
            console.log('INP- replacing request with stored favicon for', iconUrl)
            writeSvg(svg);
            filter.close();
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
            const fullData = concatenateArrayBuffer(data);

            const [svg, largestFaviconUrl] = await Promise.all([
                Tracer.traceBuffer(fullData),
                largestFaviconUrlPromise
            ] as const);

            const isLargestFavicon = !largestFaviconUrl || iconUrl.includes(largestFaviconUrl)
            isLargestFavicon && IconStorage.storeIcon(iconUrl, svg);
            writeSvg(svg);
            filter.disconnect();
        };

        return {};
    }

    function concatenateArrayBuffer(buffers: ArrayBuffer[]): Uint8Array {
        const length = buffers.reduce((length, buffer) => length + buffer.byteLength, 0);
        const concatBuffer = new Uint8Array(length);
        let offset = 0;
        for (const buffer of buffers) {
            concatBuffer.set(new Uint8Array(buffer), offset);
            offset += buffer.byteLength
        }

        return concatBuffer
    }

    async function isFaviconUrlInTab(tabId: number, url: string): Promise<boolean>{
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
        console.log('is favicon', hasLink, url, urlEnd)
        return hasLink
    }
}