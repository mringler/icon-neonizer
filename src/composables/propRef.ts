import { ref, Ref, watchEffect } from 'vue'

export function usePropRef<T, K extends keyof T>(props: T, key: K) {
    const resolvedValue: Ref<T[K]> = ref() as Ref<T[K]>
    watchEffect(() => resolvedValue.value = props[key])
    return resolvedValue
}