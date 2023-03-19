import { h, ref, Ref, unref, watchEffect } from 'vue'
import HelpOverlay from '@/components/util/HelpOverlay.vue';
import { VDataTable } from 'vuetify/labs/components';

type HelpProps<D> = {
    description: string | Ref<string>,
    tableData?: { data: D[], keys: (keyof D)[] }
}

type InputConfig = {
    attrs: Record<string, any>
    slots: Record<string, () => ReturnType<typeof h>>
}

export function useInputConfig<D>(
    showHelp: Ref<boolean>,
    helpProps: HelpProps<D>
) {
    const config: Ref<InputConfig> = ref({
        attrs: {
            hideDetails: true,
        },
        slots: {}
    })

    const renderHelp = buildHelpRenderer(helpProps)

    watchEffect(() => config.value.slots = showHelp.value ? { append: renderHelp } : {})

    return config
}

function buildHelpRenderer<D>(helpProps: HelpProps<D>) {
    return () => {
        const { description, tableData } = helpProps
        const table = !tableData ? undefined : h(
            VDataTable,
            {
                items: tableData.data,
                headers: tableData.keys.map(key => ({ key, title: key })) as VDataTable['headers'],
            },
            {
                bottom: () => null
            })
        const slot = () => [h('div', unref(description)), table]
        return h(HelpOverlay, slot)
    }
}
