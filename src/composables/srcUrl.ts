import { InlineImageLoader } from '@/scripts/background/inline-image-loader'
import { toFaviconDownloadUrl } from '@/util/to-favicon-download-url'
import { ref, Ref, isRef, unref, watchEffect } from 'vue'

export function useSrcUrl(url: string | Ref<string>) {
    const srcUrl: Ref<Promise<string>> = ref() as Ref<Promise<string>>

    async function buildUrl() {
        const urlString = unref(url)
        const isInline = urlString.startsWith(InlineImageLoader.INLINE_ICON_DUMMY_URL)
        srcUrl.value = isInline ? loadInlineUrl(urlString) : 
            Promise.resolve(toFaviconDownloadUrl(urlString))
    }

    async function loadInlineUrl(urlString: string){
        let inlineUrl = await InlineImageLoader.fetchHref(urlString)
        if (inlineUrl?.startsWith('/')){
            inlineUrl = urlString + inlineUrl
        }
        return inlineUrl ?? Promise.reject()
    }

    if (isRef(url)) {
        watchEffect(buildUrl)
    } else {
        buildUrl()
    }

    return srcUrl
}