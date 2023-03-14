import { ref, Ref, isRef, unref, watchEffect } from 'vue'

export function useAwaited<T = any>(promise: Promise<T> | Ref<Promise<T>|null>) {
    
    const resolvedValue: Ref<Awaited<T>|null> = ref(null)
    const loading = ref(false)

    async function awaitPromise(){
        loading.value = true
        resolvedValue.value = await unref(promise)
        loading.value = false
    }

    if (isRef(promise)) {
        watchEffect(awaitPromise)
    } else {
        awaitPromise()
    }

    return [resolvedValue, loading] as const
}