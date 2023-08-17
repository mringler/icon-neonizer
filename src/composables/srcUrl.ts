import { InlineImageLoader } from '@/scripts/background/inline-image-loader'
import { toFaviconDownloadUrl } from '@/util/to-favicon-download-url'
import { ref, type Ref, isRef, unref, watchEffect } from 'vue'

export function useSrcUrl(url: string | Ref<string>) {
    const srcUrl: Ref<Promise<string>> = ref() as Ref<Promise<string>>
    const isSvg = ref(false)

    async function buildUrl() {
        const urlString = unref(url)
        const isInline = urlString.startsWith(InlineImageLoader.INLINE_ICON_DUMMY_URL)
        srcUrl.value = isInline
            ? loadInlineUrl(urlString)
            : Promise.resolve(toFaviconDownloadUrl(urlString))

        const resoledUrl = await srcUrl.value
        isSvg.value = resoledUrl.startsWith('data:') 
            ? resoledUrl.startsWith('data:image/svg+xml')
            : resoledUrl.endsWith('.svg') || resoledUrl.includes('.svg?')
    }

    async function loadInlineUrl(urlString: string) {
        let inlineUrl = await InlineImageLoader.fetchHref(urlString)
        if (inlineUrl?.startsWith('/')) {
            inlineUrl = urlString + inlineUrl
        }
        if (inlineUrl?.startsWith('http')) {
            inlineUrl = toFaviconDownloadUrl(inlineUrl)
        }
        return inlineUrl ?? Promise.reject()
    }

    if (isRef(url)) {
        watchEffect(buildUrl)
    } else {
        buildUrl()
    }

    return { srcUrl, isSvg }
}
