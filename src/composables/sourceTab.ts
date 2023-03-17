import { ref, inject, provide, onBeforeMount } from 'vue'
import type { InjectionKey, Ref } from 'vue'
import { loadOpenerTab } from '@/util/active-tab'
import { callContentApi } from '@/util/content-api-caller'

const SourceTabSymbol: InjectionKey<{
    sourceTab: Ref<browser.tabs.Tab | null>,
    sourceIconUrl: Ref<string | null>,
    loading: Ref<boolean>,
}> = Symbol.for('inp:source-tab')

export function createSourceTab(onLoadedCallback: (sourceTab: browser.tabs.Tab|null, sourceIconUrl: string|null) => unknown) {

    const sourceTab: Ref<browser.tabs.Tab | null> = ref(null)
    const sourceIconUrl: Ref<string | null> = ref(null)
    const loading = ref(true)
    const data = { sourceTab, sourceIconUrl, loading }

    provide(SourceTabSymbol, data)

    onBeforeMount(async () => {
        const tab = await loadOpenerTab()
        sourceTab.value = tab
        try {
            sourceIconUrl.value = await callContentApi('getOriginalFaviconUrl', [], tab?.id)
        } catch (e) {
            // receiving end does not exist, just log the error
            console.log('During call to content api:', e)
        }
        loading.value = false
        onLoadedCallback(sourceTab.value, sourceIconUrl.value)
    })

    return data
}

export function useSourceTab() {
    const sourceTab = inject(SourceTabSymbol)

    if (!sourceTab) throw new Error('Failed to inject SourceTab!')

    return sourceTab
}