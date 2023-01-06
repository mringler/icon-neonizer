<script setup lang="ts">
import type { AlertSnackbarProps } from '@/components/AlertSnackbar.vue';
import AlertSnackbar from '@/components/AlertSnackbar.vue';
import type { ImageDataRecord } from '@/scripts/background/icon-storage';
import { callBackgroundApi } from '@/util/background-api';
import { onBeforeMount, Ref, ref } from 'vue'

const storageData: Ref<ImageDataRecord[]> = ref([])
const loading = ref(true)
const snackbarInput: Ref<AlertSnackbarProps> = ref({ message: null })

onBeforeMount(async () => {
    storageData.value = await callBackgroundApi('getStoredIcons', [])
    loading.value = false
})

const remove = async (record: ImageDataRecord) => {
    await callBackgroundApi('removeIcon', [record.url])
    const ix = storageData.value.findIndex(el => el === record)
    storageData.value.splice(ix, 1)
    snackbarInput.value = { message: 'Icon removed from storage', color: 'green' }
}

const timestampToDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    const language = navigator.languages[0]
    return date.toLocaleString(language)
}
</script>

<template>


    <AlertSnackbar
        v-model:message="snackbarInput.message"
        :color="snackbarInput.color"
    />

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
                v-for="item in storageData"
                :key="item.url"
            >
                <td><img
                        :src="item.url"
                        class="icon-display"
                    /></td>
                <td
                    v-html="item.icon"
                    class="icon-display"
                ></td>
                <td>
                    <div class="url-display">{{ item.url }}</div>
                </td>
                <td>{{ timestampToDate(item.lastAccess) }}</td>
                <td>{{ (item.size / 1000).toFixed(1) }}</td>
                <td><v-icon v-if="item.noAutomaticOverride" icon="mdi-lock"/></td>
                <td>
                    <v-btn
                        variant="plain"
                        color="primary"
                        icon="mdi-pen"
                        :to="{ name: 'edit-by-url', params: { url: item.url, isLocked: item.noAutomaticOverride ? 1 : 0 } }"
                    />
                    <v-btn
                        variant="plain"
                        color="primary"
                        icon="mdi-delete"
                        @click.stop="remove(item)"
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
    word-wrap: break-word;
}

.icon-display {
    height: 72px;
}
</style>
