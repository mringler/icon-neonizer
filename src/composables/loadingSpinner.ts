import { ref, inject, provide } from 'vue'
import type { InjectionKey, Ref } from 'vue'

type LoadingSpinnerData = {
    setLoading: (value: boolean) => void,
    withLoading: <T>(loader: () => Promise<T>) => Promise<T>,
    loadingItems: Ref<number>,
}

const LoadingSpinnerSymbol: InjectionKey<LoadingSpinnerData> = Symbol.for('inp:loading-spinner')

export function createLoadingSpinner() {
    const loadingItems = ref(0)
    const data: LoadingSpinnerData = {
        setLoading(value: boolean) {
            loadingItems.value += value ? 1 : -1
        },
        async withLoading(loader) {
            loadingItems.value++
            const res = await loader()
            loadingItems.value--
            return res
        },
        loadingItems,
    }
    provide(LoadingSpinnerSymbol, data)
    return loadingItems
}

export function useLoadingSpinner() {
    const loadingSpinnerData = inject(LoadingSpinnerSymbol)

    if (!loadingSpinnerData) throw new Error('Failed to inject LoadingSpinner!')

    return loadingSpinnerData
}


