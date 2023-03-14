import { InlineImageLoader } from '@/scripts/background/inline-image-loader'
import { ImageLoader } from '@image-tracer/browser'
import { ref, Ref, isRef, unref, watchEffect } from 'vue'
import { useSrcUrl } from './srcUrl'

export function useImageData(url: string | Ref<string>): Ref<Promise<ImageData>> {
    
    const urlPromise = useSrcUrl(url)

    async function loadImageData() : Promise<ImageData>{
        const resolvedUrl = await urlPromise.value
        if (!resolvedUrl){
            return Promise.reject()
        }
        if (!resolvedUrl.startsWith('data:image')) {
            return ImageLoader.loadUrl(resolvedUrl)
        }
        const [type, data] = InlineImageLoader.parseIcon(resolvedUrl)
        if (type === 'data:image/svg+xml') {
            return Promise.reject()
        }
        return ImageLoader.loadImageDataFromBytes(new TextEncoder().encode(data))
    }

    const imageData: Ref<Promise<ImageData> | null> = ref(null)

    async function setImageData() {
        imageData.value = loadImageData()
    }

    if (isRef(url)) {
        watchEffect(setImageData)
    } else {
        setImageData()
    }

    return imageData
}