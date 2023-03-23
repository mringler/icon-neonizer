import { InlineImageLoader } from '../inline-image-loader'
import { Blacklist } from '../storage/blacklist'
import { IconStorage } from '../storage/icon-storage'

export namespace TouchIconRequestFilter {
    export function setRequestFilter() {
        const pattern: browser.webRequest.RequestFilter = {
            urls: ['*://*/*apple-touch*'],
            types: ['image'],
        }

        browser.webRequest.onHeadersReceived.addListener(updateHeaderContentType, pattern, [
            'blocking',
            'responseHeaders',
        ])

        browser.webRequest.onBeforeRequest.addListener(replaceIconFilter, pattern, ['blocking'])
    }

    async function updateHeaderContentType(
        headerDetails: browser.webRequest._OnHeadersReceivedDetails
    ): Promise<browser.webRequest.BlockingResponse> {
        const headers = headerDetails.responseHeaders
        if (!headers) {
            return {}
        }

        const { faviconUrl, isInline } = await getReplacementUrlForTouchIconInTab(
            headerDetails.tabId,
            headerDetails.url
        )
        const storedIcon = isInline
            ? faviconUrl
            : faviconUrl && (await IconStorage.loadIcon(faviconUrl))
        if (!storedIcon) {
            console.log(
                'AT - no icon for',
                headerDetails.url,
                faviconUrl?.substring(0, 30),
                storedIcon
            )
            return {}
        }
        console.log('AT - replacing with', headerDetails.url, storedIcon?.substring(0, 30))

        const contentType = headers.find((header) => header.name === 'content-type')
        if (contentType) {
            contentType.value = 'image/svg+xml'
        } else {
            headers.push({ name: 'content-type', value: 'image/svg+xml' })
        }
        return { responseHeaders: headers }
    }

    async function replaceIconFilter(
        requestDetails: browser.webRequest._OnBeforeRequestDetails
    ): Promise<browser.webRequest.BlockingResponse> {
        let { faviconUrl, isInline } = await getReplacementUrlForTouchIconInTab(
            requestDetails.tabId,
            requestDetails.url
        )
        if (!faviconUrl) {
            return {}
        }

        const filter = browser.webRequest.filterResponseData(requestDetails.requestId)
        const writeSvg = (svg: string) => {
            const encoder = new TextEncoder()
            filter.write(encoder.encode(svg))
            filter.close()
        }

        if (isInline) {
            const [, iconData] = InlineImageLoader.parseIcon(faviconUrl)
            writeSvg(iconData!)
            return {}
        }

        const blacklistEntry = await Blacklist.getBlacklistEntry(faviconUrl)
        if (blacklistEntry?.replacementUrl) {
            faviconUrl = blacklistEntry.replacementUrl
        }

        const storedIconPromise = IconStorage.loadIcon(faviconUrl)

        filter.onstart = async () => {
            const svg = await storedIconPromise

            if (!svg) {
                filter.disconnect()
                return
            }
            writeSvg(svg)
        }
        return {}
    }

    async function getReplacementUrlForTouchIconInTab(
        tabId: number,
        url: string
    ): Promise<{ faviconUrl: string | null; isInline: boolean }> {
        const urlEnd = url.replace(/https?:\/\/[^\/]+\//, '/')
        const [faviconUrl] = await browser.tabs.executeScript(tabId, {
            code: `
            (function(){
                const touchIconLink = document.querySelector('link[rel~="apple-touch-icon"][href$="${urlEnd}"]');
                if(!touchIconLink){
                    return null
                }
                touchIconLink.type = 'image/svg+xml';
                const faviconLinks = document.querySelectorAll('link[rel~="icon"]');
                return faviconLinks[0]?.href ?? null
            })()
            `,
            runAt: 'document_start',
        })
        const isInline = faviconUrl?.startsWith('data:image/svg+xml') ?? false

        return { faviconUrl, isInline }
    }
}
