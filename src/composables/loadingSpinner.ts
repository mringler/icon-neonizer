import { ref, inject, provide } from 'vue'
import type { InjectionKey, Ref } from 'vue'

const LoadingSpinnerSymbol: InjectionKey<{
    setLoading: (value: boolean) => void,
    withLoading: <T>(promise: Promise<T>) => Promise<T>,
    loadingItems: Ref<number>,
}> = Symbol.for('inp:loading-spinner')

export function createLoadingSpinner() {
    const loadingItems = ref(0)
    const data = {
        setLoading(value: boolean){
            loadingItems.value += value ? 1 : -1
        },
        async withLoading(promise: Promise<any>){
            loadingItems.value++
            const res = await promise
            loadingItems.value--
            return res
        },
        loadingItems,
    }
    provide(LoadingSpinnerSymbol, data)
    return loadingItems
}

export function useLoadingSpinner() {
    const showDialog = inject(LoadingSpinnerSymbol)

    if (!showDialog) throw new Error('Failed to inject LoadingSpinner!')

    return showDialog
}

/////////


