<script setup lang="ts">
import { callContentApi } from '@/util/content-api';
import Loading from '@/components/Loading.vue';
import { inject, onBeforeMount, ref, Ref } from 'vue'
import SvgEditor from '@/components/SvgEditorFromUrl.vue';
import AlertNoSourceTab from '@/components/AlertNoSourceTab.vue';
import {loadOpenerTab} from '@/util/active-tab'

const originalUrl: Ref<string | null> = ref(null)
const loading = ref(true)
const noOpenerTab = ref(false)

onBeforeMount(async () => {
    const tab = await loadOpenerTab()
    if(!tab){
        noOpenerTab.value = true
        return
    }
    originalUrl.value = await callContentApi('getOriginalFaviconUrl', [], tab)
    loading.value = false
})
</script>

<template>

    <AlertNoSourceTab v-if="noOpenerTab"/>
    <Loading v-else-if="loading" />
    <SvgEditor
        v-else
        :url="originalUrl as string"
    />

</template>
<style scoped>

</style>
