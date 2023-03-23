import { Favicon } from '../content/favicon'

export type ParsedInlineIconData = [contentType?: string, iconData?: string]

export namespace InlineImageLoader {
    export const INLINE_ICON_DUMMY_URL = 'https://icon-neonizer-inline-image.dummy'

    export async function fetchIcon(pageUrl: string): Promise<ParsedInlineIconData> {
        const inlineIcon = await fetchHref(pageUrl)
        return !inlineIcon ? [] : InlineImageLoader.parseIcon(inlineIcon)
    }

    /**
     * Load the given page and get the favicon href.
     */
    export async function fetchHref(pageUrl: string): Promise<string | undefined> {
        if (pageUrl.startsWith(INLINE_ICON_DUMMY_URL)) {
            pageUrl = decodeURIComponent(pageUrl.split('=')[1])
        }
        const pageHtml = await fetch(pageUrl).then((r) => r.text())
        const dom = new DOMParser().parseFromString(pageHtml, 'text/html')
        const baseEl = dom.createElement('base')
        baseEl.setAttribute('href', pageUrl)
        dom.head.append(baseEl)
        return Favicon.getPageFaviconHref(dom)
    }

    export function parseIcon(inlineData: string): ParsedInlineIconData {
        //data:image/png;base64,
        //data:[<mediatype>][;base64],<data>

        if (!inlineData.startsWith('data:image')) {
            throw new Error('Inline data does not start with "data:image": `' + inlineData.substring(0, 32) + "...`")

        }
        const colonPos = inlineData.indexOf(',')!
        const type = inlineData.substring(0, colonPos)
        const imageData = inlineData.substring(colonPos + 1).trim()
        const [contentType, encoding] = type.split(';').map((s) => s.trim())
        const data =
            encoding?.toLowerCase() === 'base64' ? atob(imageData) : decodeURIComponent(imageData)

        return [contentType, data]
    }
}
