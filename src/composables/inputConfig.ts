import { h, ref,type Ref, unref, watchEffect } from 'vue'
import HelpOverlay from '@/components/util/HelpOverlay.vue'
import { VDataTable } from 'vuetify/labs/components'

type HelpProps<D> = {
    maxWidth?: number
    description: string | Ref<string>
    tableData?: { data: D[]; keys: Partial<Record<keyof D, string>> }
}

type CommonSlotName = 'append'

type InputConfig = {
    attrs: Record<string, any>
    slots: {} | {[key in CommonSlotName]: () => ReturnType<typeof h>}
}

export function useInputConfig<D>(showHelp: Ref<boolean>, helpProps: HelpProps<D>) {
    const config: Ref<InputConfig> = ref({
        attrs: {
            hideDetails: true,
        },
        slots: {},
    })

    const renderHelp = buildHelpRenderer(helpProps)

    watchEffect(() => (config.value.slots = showHelp.value ? { append: renderHelp } : {}))

    return config
}

function buildHelpRenderer<D>(helpProps: HelpProps<D>) {
    return () => {
        const { description, tableData, maxWidth } = helpProps
        const table = !tableData
            ? undefined
            : h(
                VDataTable,
                {
                    theme: 'light',
                    density: 'compact',
                    items: tableData.data,
                    headers: Object.entries(tableData.keys).map(([key, title]) => ({
                        key,
                        title,
                    })) as VDataTable['headers'],
                    class: 'border mt-3',
                },
                {
                    bottom: () => null,
                }
            )

        const slot = () => [h('div', unref(description)), table]
        return h(HelpOverlay, { maxWidth: maxWidth ?? 500 }, slot)
    }
}
