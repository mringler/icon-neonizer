
import { IconStorage } from '@/scripts/background/storage/icon-storage';
import { GradientDrawerOptionsUtil } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';
import { Tracer } from '@/scripts/background/tracer/tracer';
import { Ref, ref } from 'vue';

export type TracerOptionDiff = {
    property: string
    value: any
    default: any
}

export function useTracerOptionsDiff() {
    const tracerOptionsDiff = ref([] as TracerOptionDiff[])
    const loading: Ref<Promise<TracerOptionDiff[]> | undefined> = ref()

    const doLoad = async () => {
        const storedOptions = await IconStorage.loadOptions()
        if (!storedOptions) {
            return []
        }

        const defaultOptions = GradientDrawerOptionsUtil.buildFrom(Tracer.getTracerOptionsPreset())

        const isKey = (s: string): s is keyof typeof defaultOptions => s in defaultOptions
        return Object.entries(storedOptions)
            .filter(([prop, value]) => isKey(prop) && defaultOptions[prop] !== value)
            .map(([property, value]) => ({ property, default: isKey(property) && defaultOptions[property], value }))
            .sort((a, b) => a.property.localeCompare(b.property))
    }

    const load = () => {
        loading.value = doLoad().then(diff => {
            tracerOptionsDiff.value = diff
            loading.value = undefined
            return diff
        })
        return loading.value
    }

    load()

    return { tracerOptionsDiff, reloadDiff: load, loading }
}