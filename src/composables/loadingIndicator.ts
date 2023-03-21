import { ref } from 'vue'
import type { Ref } from 'vue'


export function useLoadingIndicator(initialState = false) {
    const loading = ref(initialState)
    const indicate = <T>(loader: () => Promise<T>) => indicateLoading(loading, loader)
    return {loading, indicateLoading: indicate}
}

export async function indicateLoading<T>(loading: Ref<boolean>, loader: () => Promise<T>) {
    loading.value = true
    const res = await loader()
    loading.value = false
    return res
}


