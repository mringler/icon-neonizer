import { IconStorage } from "./icon-storage";
import { Tracer } from "./tracer";

export namespace FaviconRequestFilter {

    export function setRequestFilter() {
        const pattern = { urls: ['*://*/favicon.ico'] }
        browser.webRequest.onBeforeRequest.addListener(
            requestFilter,
            pattern,
            ["blocking"]
        );
        browser.webRequest.onHeadersReceived.addListener(
            setContentTypeHeader,
            pattern,
            ["blocking", "responseHeaders"]
        );
    }

    function requestFilter(requestDetails: browser.webRequest._OnBeforeRequestDetails): browser.webRequest.BlockingResponse | undefined | Promise<browser.webRequest.BlockingResponse> {
        const iconUrl = requestDetails.url;
        const filter = browser.webRequest.filterResponseData(requestDetails.requestId);
        const data: ArrayBuffer[] = [];

        const storedIconPromise = IconStorage.loadIcon(iconUrl);

        const writeSvg = (svg: string) => {
            const encoder = new TextEncoder();
            filter.write(encoder.encode(svg));
        }

        filter.onstart = async () => {
            const svg = await storedIconPromise;
            if (!svg) {
                return
            }
            writeSvg(svg);
            filter.close();
        }

        filter.ondata = async (event: browser.webRequest._StreamFilterOndataEvent) => {
            data.push(event.data)
        }

        filter.onstop = async (event: Event) => {
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

    function setContentTypeHeader(headerDetails: browser.webRequest._OnHeadersReceivedDetails) {
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
}