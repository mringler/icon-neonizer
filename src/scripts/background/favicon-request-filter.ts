import { Blacklist } from "./blacklist";
import { IconStorage } from "./icon-storage";
import { Tracer } from "./tracer";

export namespace FaviconRequestFilter {

    export function setRequestFilter() {
        const pattern = { urls: ['*://*/favicon.ico'] }
        browser.webRequest.onBeforeRequest.addListener(
            setReplaceIconFilter,
            pattern,
            ["blocking"]
        );

        browser.webRequest.onHeadersReceived.addListener(
            updateHeaderContentType,
            pattern,
            ["blocking", "responseHeaders"]
        );
    }

    const passFilterRegex = /passFilter=1$/

    function updateHeaderContentType(headerDetails: browser.webRequest._OnHeadersReceivedDetails) {
        if (passFilterRegex.test(headerDetails.url)) {
            return
        }
        const headers = headerDetails.responseHeaders
        if (!headers) {
            return
        }

        const contentType = headers.find(header => header.name === 'content-type');
        if (contentType) {
            contentType.value = 'image/svg+xml'
        } else {
            headers.push({ name: 'content-type', value: 'image/svg+xml' });
        }
        return { responseHeaders: headers };
    }



    async function setReplaceIconFilter(requestDetails: browser.webRequest._OnBeforeRequestDetails): Promise<browser.webRequest.BlockingResponse> {
        const iconUrl = requestDetails.url;
        if (passFilterRegex.test(iconUrl)) {
            return {}
        }
        const blacklistEntry = await Blacklist.getBlacklistEntry(iconUrl)
        if (blacklistEntry?.replacementUrl) {
            return {
                redirectUrl: blacklistEntry.replacementUrl
              };
        }

        const filter = browser.webRequest.filterResponseData(requestDetails.requestId);
        const data: ArrayBuffer[] = [];

        const storedIconPromise = IconStorage.loadIcon(iconUrl);

        const writeSvg = (svg: string) => {
            const encoder = new TextEncoder();
            filter.write(encoder.encode(svg));
        }

        /**
         * If image exists in cache, send it and end request.
         */
        filter.onstart = async () => {
            const svg = await storedIconPromise;
            if (!svg) {
                return
            }
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
}