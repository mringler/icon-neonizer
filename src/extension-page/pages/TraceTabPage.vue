<script setup lang="ts">
import { ref, Ref, onBeforeMount, toRaw } from 'vue'
import TraceUrlPage from './TraceUrlPage.vue';
import { loadOriginalUrl as loadOriginalFaviconUrl } from '../../util/content-api';
import AlertNoSourceTab from '@/components/AlertNoSourceTab.vue';
import { loadOpenerTab } from '@/util/active-tab';


const url: Ref<string | null> = ref(null)
const noOpenerTab = ref(false)

async function loadUrl() {
    const fromTab = await loadOpenerTab()
    console.log(fromTab)
    if (!fromTab) {
        noOpenerTab.value = true
        return
    }
    url.value = await loadOriginalFaviconUrl(fromTab)
}
onBeforeMount(loadUrl)

</script>

<template>
    <AlertNoSourceTab v-if="noOpenerTab"/>
    <TraceUrlPage
        v-if="url"
        :url="url"
    />
    

</template>
<style scoped>

</style>
