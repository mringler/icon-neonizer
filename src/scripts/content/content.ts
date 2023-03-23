import { InlineImageLoader } from '../background/inline-image-loader'
import { initContentApi, replaceFavicon } from './content-api'
import { Favicon } from './favicon'
;(async function () {
    const [iconUrl, inlineData] = resolveIconUrl()

    initContentApi(iconUrl)
    replaceFavicon(iconUrl, false, inlineData)
})()

function resolveIconUrl(): [string, string?] {
    const iconUrl = Favicon.getPageFaviconHref()
    const isInline = iconUrl?.startsWith('data:image') ?? false
    if (isInline) {
        const replacementUrl = `${InlineImageLoader.INLINE_ICON_DUMMY_URL}?source=${location.origin}`
        return [replacementUrl, iconUrl!]
    }

    if (iconUrl) {
        return [iconUrl]
    }

    const url = window.location.origin + '/favicon.ico'
    return [url]
}
