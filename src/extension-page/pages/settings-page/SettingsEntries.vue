<script setup lang="ts">
import type { ComputedRef } from 'vue';
import { computed } from 'vue';
import { useSettings } from './composables/settings';
import type { RouteLocationRaw } from 'vue-router';
import { router } from '../routes';
import Heading from '@/components/util/Heading.vue';
import { FaviconRequestFilterType } from '@/scripts/background/request-filter/FaviconRequestFilterType';
import { useTracerOptionsDiff } from './composables/tracerOptionsDiff';
import SettingsRows from './SettingsRows.vue';
import { mdiDeleteClockOutline, mdiMenuOpen, mdiCheckCircle, mdiMinusCircle, mdiStar, mdiFileReplaceOutline, mdiPencil } from '@mdi/js'

const settings = useSettings().settings

type SettingsEntry = {
    icon: string
    text: string
    value: {
        icon?: string
        iconColor?: string
        text: string
        cellClass?: string
    },
    route: RouteLocationRaw,
}

const {tracerOptionsDiff} = useTracerOptionsDiff()

const items: ComputedRef<SettingsEntry[]> = computed((): SettingsEntry[] => !settings.value ? [] : [
    {
        icon: mdiDeleteClockOutline,
        text: 'Storage period for unused icons',
        value: {
            text: settings.value.cleanupIntervalDays + ' Days',
        },
        route: { name: 'cleanup' },
    }, {
        icon: mdiMenuOpen,
        text: 'Add link to tabs context menu',
        value: settings.value.enableTabMenu ? {
            text: 'On',
            icon: mdiCheckCircle,
            iconColor: 'info',
        } : {
            text: 'Off',
            icon: mdiMinusCircle,
            //iconColor: 'primary',
        },
        route: { name: 'tab-menu' },
    }, {
        icon: mdiStar,
        text: 'Use custom trace options',
        value: tracerOptionsDiff.value.length > 0 ? {
            text: `Changed ${tracerOptionsDiff.value.length} ` + (tracerOptionsDiff.value.length === 1 ? 'property' : 'properties'),
            icon: mdiStar,
            iconColor: 'info'
        } : {
            text: 'Using presets'
        },
        route: { name: 'reset-trace-options' },
    }, {
        icon: mdiFileReplaceOutline,
        text: 'Replace favicon responses',
        value: {
            text: (settings.value.faviconRequestFilter == FaviconRequestFilterType.fallback ? 'When necessary' : 'When possible') 
                + (settings.value.filterTouchIcon ? '. Also replace touch icons' : ''),
        },
        route: { name: 'request-filter-settings' },
    }
])

</script>

<template>
    <div>
        <Heading
            title="Settings"
            subtitle="Adjust app behavior"
        />
        <v-card
            class="mx-auto"
            style="max-width: 900px;"
        >
            <v-table hover>
                <tbody>
                    <tr
                        v-for="item in items"
                        :key="item.text"
                        @click="() => router.push(item.route)"
                    >
                        <td><v-icon class="mr-4">{{ item.icon }}</v-icon> {{ item.text }}</td>
                        <td :class="item.value.cellClass">
                            <v-icon
                                start
                                size="small"
                                v-if="item.value.icon"
                                :color="item.value.iconColor"
                                :icon="item.value.icon"
                            ></v-icon>
                            <span>
                                {{ item.value.text }}
                            </span>
                        </td>
                        <td><v-icon :icon="mdiPencil"/></td>
                    </tr>
                </tbody>
            </v-table>

            <SettingsRows :items="items" class="mt-12"/>
        </v-card>
    </div>
</template>
<style scoped>
td:nth-child(1) {
    width: 50%;
}

td:nth-child(3) {
    width: 0;
}

tr {
    cursor: pointer;
}
</style>
