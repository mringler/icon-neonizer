<script setup lang="ts">
import type { ImageDataRecord } from '@/scripts/background/icon-storage';
import {byteToKilobyte} from '@/util/byte-to-kilobyte'
import DownloadSvgButton from './DownloadSvgButton.vue';
import FaviconImg from './image-display/FaviconImg.vue';
import FaviconSvg from './image-display/FaviconSvg.vue';

type Props = {
    imageRecords: ImageDataRecord[]
}
const props = withDefaults(defineProps<Props>(),{
    imageRecords: () => [] as ImageDataRecord[]
})

const emit = defineEmits(['removeRecord'])

const timestampToDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    const language = navigator.languages[0]
    return date.toLocaleString(language)
}

</script>

<template>
    <v-table
        theme="dark"
        class="storage-table"
    >
        <thead>
            <tr>
                <th class="text-left">
                    Original
                </th>
                <th class="text-left">
                    Replacement
                </th>
                <th class="text-left">
                    URL
                </th>
                <th class="text-left">
                    Last Access
                </th>
                <th class="text-left">
                    Size [kB]
                </th>
                <th class="text-left">
                    Locked
                </th>
                <th class="text-left">
                    Actions
                </th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="record in props.imageRecords"
                :key="record.url"
            >
                <td>
                    <FaviconImg
                        :src="record.url"
                        width="72px"
                        height="72px"
                        noFrame
                    />
                </td>
                <td>
                    <FaviconSvg
                        :svg="record.icon"
                        width="72px"
                        height="72px"
                        noFrame
                    />
                </td>
                <td>
                    <div class="url-display">{{ record.url }}</div>
                </td>
                <td>{{ timestampToDate(record.lastAccess) }}</td>
                <td>{{ byteToKilobyte(record.size) }}</td>
                <td><v-icon
                        v-if="record.noAutomaticOverride"
                        icon="mdi-lock"
                    /></td>
                <td>
                    <v-btn
                        variant="plain"
                        icon="mdi-draw"
                        :to="{ name: 'trace-by-url', params: { url: record.url } }"
                    />
                    <v-btn
                        variant="plain"
                        icon="mdi-pen"
                        :to="{ name: 'edit-by-url', params: { url: record.url }, query: { isLocked: record.noAutomaticOverride ? 1 : 0 } }"
                    />
                    <DownloadSvgButton
                        variant="plain"
                        :url="record.url"
                        :svg="record.icon"
                    />
                    <v-btn
                        variant="plain"
                        icon="mdi-delete"
                        :disabled="record.noAutomaticOverride"
                        @click.stop="emit('removeRecord', record)"
                    />

                </td>
            </tr>
        </tbody>
    </v-table>

</template>
<style scoped>
.storage-table table {
    max-width: 512;
}

.url-display {
    word-wrap: anywhere;
}

.icon-display {
    height: 72px;
}

</style>
