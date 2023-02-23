import { callContentApi } from "@/util/content-api";
import { Blacklist } from "./blacklist";
import { IconStorage } from "./icon-storage";
import { Tracer } from "./tracer";

export namespace FaviconRequestFilter {

    export function setRequestFilter() {
        const pattern: browser.webRequest.RequestFilter = { urls: ['*://*/*favicon*'], types: ['image'] }

        browser.webRequest.onBeforeRequest.addListener(
            checkLargestFavicon,
            pattern,
            ["blocking"]
        );

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

    async function checkLargestFavicon(details: browser.webRequest._OnBeforeRequestDetails): Promise<browser.webRequest.BlockingResponse>{

        if (passFilterRegex.test(details.url)){
            return {}
        }
        const url = await callContentApi('getPageFaviconHref', [], details.tabId)
        console.log('PRE RP', details.url, passFilterRegex.test(details.url), url)
        const [largestFaviconUrl, isFavicon] = await Promise.all([
            callContentApi('getPageFaviconHref', [], details.tabId),
            isFaviconUrlInTab(details.tabId, details.url),
        ] as const)

        console.log('XXXXXXXXXXXXX checking favicon', details.url, largestFaviconUrl)
        if(isFavicon && details.url !== largestFaviconUrl){
            console.log('redirecting favicon', details.url, largestFaviconUrl)
            return {redirectUrl: largestFaviconUrl!}
        }
        return {}
    }

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

        const filter = browser.webRequest.filterResponseData(details.requestId);
        const data: ArrayBuffer[] = [];

        const storedIconPromise = IconStorage.loadIcon(iconUrl);
        const isFaviconPromise = updateLinkTagInTab(details.tabId, details.url)

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
                if(!details.url.endsWith('/favicon.ico') && !isFavicon ){
                    console.log('unknown regular favicon - regular process for', details.url)
                    filter.disconnect()
                }
                return
            }
            console.log('delivering stored favicon for', details.url)
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

            const svg = await Tracer.traceBuffer(fullData);
            IconStorage.storeIcon(iconUrl, svg);
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

    async function updateLinkTagInTab(tabId: number, url: string): Promise<boolean>{
        const urlEnd = url.replace(/https?:\/\/[^\/]+\//, '/')
        const [hasLink] = await browser.tabs.executeScript(tabId, {
            code: `
            (function(){
                const links = document.querySelectorAll('link[rel~="icon"][href$="${urlEnd}"]');
                links.forEach(l => {l.type = 'image/svg+xml'; l.dataset.neFilter = "1"});
                console.log('replacing href of', links);
                return Boolean(links.length)
            })()
            `,
            runAt: 'document_start',
        })
        console.log('is favicon', hasLink, url, urlEnd)
        return hasLink
    }

}