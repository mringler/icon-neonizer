<script setup lang="ts">
import { ref } from 'vue'
import type { ImageDataRecord } from '@/scripts/background/storage/icon-storage'
import { byteToKilobyte } from '@/util/byte-to-kilobyte'
import DownloadSvgButton from './DownloadSvgButton.vue'
import FaviconImg from '../image-display/FaviconImg.vue'
import FaviconSvg from '../image-display/FaviconSvg.vue'
import { VDataTable } from 'vuetify/lib/labs/components'

type DT = InstanceType<typeof VDataTable>
type Headers = DT['headers']
type ArrayItems<T> = T extends Array<Array<infer I>> ? I : never
type DataTableHeader = ArrayItems<Headers>

type SortItem = DT['sortBy'] extends Array<infer T> ? T : never

type Props = {
    imageRecords: ImageDataRecord[]
}
const props = withDefaults(defineProps<Props>(), {
    imageRecords: () => [] as ImageDataRecord[],
})

const search = ref('')

const emit = defineEmits<{
    (e: 'removeRecord', record: ImageDataRecord): void
}>()

const timestampToDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    const language = navigator.languages[0]
    return date.toLocaleString(language)
}

const headers: DataTableHeader[] = [
    { key: 'originalIcon', title: 'Original', sortable: false },
    { key: 'icon', title: 'Replacement', sortable: false },
    { key: 'url', title: 'URL', maxWidth: '480px' },
    { key: 'lastAccess', title: 'Last Access', align: 'start' },
    { key: 'size', title: 'Size [kB]', align: 'end' },
    { key: 'noAutomaticOverride', title: 'Locked', align: 'center' as any },
    { key: 'actions', title: 'Actions', sortable: false, minWidth: '134px' },
]

const sortBy = ref([{ key: 'lastAccess', order: 'desc' }] as SortItem[])

const faviconDisplayProps = {
    width: '72px',
    height: '72px',
    noFrame: true,
    class: 'ma-1',
}
</script>

<template>
    <v-card>
        <v-card-title>
            <div class="d-flex">
                <slot name="header" />

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
                    :src="item.columns.url as string"
                    v-bind="faviconDisplayProps"
                    class="overflow-hidden"
                />
            </template>
            <template v-slot:item.icon="{ item }">
                <FaviconSvg
                    :svg="item.columns.icon as string"
                    v-bind="faviconDisplayProps"
                />
            </template>

            <template v-slot:item.lastAccess="{ item }">
                {{ timestampToDate(item.columns.lastAccess as number) }}
            </template>
            <template v-slot:item.size="{ item }">
                {{ byteToKilobyte(item.columns.size as number) }}
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
                <div style="min-width: 134px">
                    <v-tooltip text="Trace again">
                        <template v-slot:activator="{ props }">
                            <v-btn
                                v-bind="props"
                                variant="plain"
                                icon="mdi-draw"
                                :to="{ name: 'trace-by-url', params: { url: item.columns.url as string} }"
                            />
                        </template>
                    </v-tooltip>
                    <v-tooltip text="Edit">
                        <template v-slot:activator="{ props }">
                            <v-btn
                                v-bind="props"
                                variant="plain"
                                icon="mdi-pen"
                                :to="{
                                    name: 'edit-by-url',
                                    params: { url: item.columns.url as string },
                                    query: { isLocked: item.columns.noAutomaticOverride ? 1 : 0 },
                                }"
                            />
                        </template>
                    </v-tooltip>
                    <v-tooltip text="Download">
                        <template v-slot:activator="{ props }">
                            <DownloadSvgButton
                                v-bind="props"
                                variant="plain"
                                :url="item.columns.url as string"
                                :svg="item.columns.icon as string"
                            />
                        </template>
                    </v-tooltip>
                    <v-tooltip text="Delete">
                        <template v-slot:activator="{ props }">
                            <v-btn
                                v-bind="props"
                                variant="plain"
                                icon="mdi-delete"
                                @click.stop="emit('removeRecord', item.raw)"
                            />
                        </template>
                    </v-tooltip>
                </div>
            </template>
        </v-data-table>
    </v-card>
</template>

<style scoped>
*:deep(.image-record-table .v-table__wrapper) {
    overflow: unset;
}

.url-display {
    word-wrap: anywhere;
}</style>
