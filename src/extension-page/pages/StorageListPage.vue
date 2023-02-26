<script setup lang="ts">
import type { AlertSnackbarProps } from '@/components/util/AlertSnackbar.vue';
import AlertSnackbar from '@/components/util/AlertSnackbar.vue';
import { IconStorage, ImageDataRecord } from '@/scripts/background/storage/icon-storage';
import { onBeforeMount, Ref, ref, computed } from 'vue'
import { byteToKilobyte } from '@/util/byte-to-kilobyte'
import ImageRecordTable from '@/components/image-record-table/ImageRecordDataTable.vue';
import DataCard from '@/components/util/DataCard.vue';
import LoadingContent from '@/components/util/LoadingContent.vue';


const storageData: Ref<ImageDataRecord[]> = ref([])
const snackbarInput: Ref<AlertSnackbarProps> = ref({ message: null })
const isLoading = ref(false)
onBeforeMount(async () => {
    isLoading.value = true
    storageData.value = await IconStorage.loadAll()
    storageData.value.sort((i1, i2) => i2.lastAccess - i1.lastAccess) // sort desc
    isLoading.value = false
})

const remove = async (record: ImageDataRecord) => {
    await IconStorage.removeIcon(record.url)
    const ix = storageData.value.findIndex(el => el === record)
    storageData.value.splice(ix, 1)
    snackbarInput.value = { message: 'Icon removed from storage', color: 'green' }
}

const dataSummary = computed(() => {

    return {
        'Stored icons': storageData.value.length,
        'Size in storage': totalSizeKb.value + ' kB'
    }
})

const totalSizeKb = computed(() => {
    const byteSize = storageData.value.reduce((sum, icon) => sum + icon.size, 0)
    return byteToKilobyte(byteSize)
})

</script>

<template>
    <AlertSnackbar
        v-model:message="snackbarInput.message"
        :color="snackbarInput.color"
    />

    <LoadingContent :is-loading="isLoading">

        <ImageRecordTable
            :imageRecords="storageData"
            @remove-record="remove"
        >
            <template v-slot:header>
                <DataCard
                    :data="dataSummary"
                    width="300px"
                    class="mb-4"
                />

            </template>
        </ImageRecordTable>
    </LoadingContent>
</template>
<style scoped></style>
