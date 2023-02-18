<script setup lang="ts">
import { ref } from 'vue'
import type { ImageDataRecord } from '@/scripts/background/icon-storage';
import { byteToKilobyte } from '@/util/byte-to-kilobyte'
import DownloadSvgButton from './DownloadSvgButton.vue';
import FaviconImg from './image-display/FaviconImg.vue';
import FaviconSvg from './image-display/FaviconSvg.vue';


type Props = {
    imageRecords: ImageDataRecord[]
}
const props = withDefaults(defineProps<Props>(), {
    imageRecords: () => [] as ImageDataRecord[]
})

const search = ref('')

const emit = defineEmits(['removeRecord'])

const timestampToDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    const language = navigator.languages[0]
    return date.toLocaleString(language)
}

const headers = [
    { key: 'originalIcon', title: 'Original', sortable: false },
    { key: 'icon', title: 'Replacement', sortable: false },
    { key: 'url', title: 'URL', maxWidth: '480px' },
    { key: 'lastAccess', title: 'Last Access', align: 'start' },
    { key: 'size', title: 'Size [kB]', align: 'end' },
    { key: 'noAutomaticOverride', title: 'Locked', align: 'center' },
    { key: 'actions', title: 'Actions', sortable: false, minWidth: '134px' },
]

const sortBy = ref([{ "key": "lastAccess", "order": "desc" }])

const faviconDisplayProps = {
    width: "72px",
    height: "72px",
    noFrame: true,
    class: 'ma-1',
}
</script>

<template>
    <v-card>
        <v-card-title>
            <div class="d-flex">
                <slot name="header"/>

                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                    clearable
                ></v-text-field>
            </div>
        </v-card-title>

        <v-data-table
            :headers="headers"
            :items="props.imageRecords"
            item-value="url"
            :search="search"
            :items-per-page="25"
            class="image-record-table"
            v-model:sortBy="sortBy"
        >
            <template v-slot:item.originalIcon="{ item }">
                <FaviconImg
                    :src="item.columns.url"
                    v-bind="faviconDisplayProps"
                />
            </template>
            <template v-slot:item.icon="{ item }">
                <FaviconSvg
                    :svg="item.columns.icon"
                    v-bind="faviconDisplayProps"
                />
            </template>

            <template v-slot:item.lastAccess="{ item }">
                {{ timestampToDate(item.columns.lastAccess) }}
            </template>
            <template v-slot:item.size="{ item }">
                {{ byteToKilobyte(item.columns.size) }}
            </template>


            <template v-slot:item.noAutomaticOverride="{ item }">
                <div class="text-center">
                    <v-icon
                        v-if="item.columns.noAutomaticOverride"
                        icon="mdi-lock"
                    />
                </div>
            </template>
            <template v-slot:item.actions="{ item }">
                <div style="min-width: 134px;">
                <v-btn
                    variant="plain"
                    icon="mdi-draw"
                    :to="{ name: 'trace-by-url', params: { url: item.columns.url } }"
                />
                <v-btn
                    variant="plain"
                    icon="mdi-pen"
                    :to="{ name: 'edit-by-url', params: { url: item.columns.url }, query: { isLocked: item.columns.noAutomaticOverride ? 1 : 0 } }"
                />
                <DownloadSvgButton
                    variant="plain"
                    :url="item.columns.url"
                    :svg="item.columns.icon"
                />
                <v-btn
                    variant="plain"
                    icon="mdi-delete"
                    :disabled="item.columns.noAutomaticOverride"
                    @click.stop="emit('removeRecord', item.columns)"
                />
            </div>
            </template>

        </v-data-table>
    </v-card>
</template>

<style scoped>
*>>>.image-record-table .v-table__wrapper {
    overflow: unset;
}

.url-display {
    word-wrap: anywhere;
}
</style>
