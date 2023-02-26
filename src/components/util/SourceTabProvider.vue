<script setup lang="ts">
import { loadOpenerTab } from '@/util/active-tab';
import { callContentApi } from '@/util/content-api';
import { onBeforeMount, Ref, ref } from 'vue';
import AlertNoSourceTab from './AlertNoSourceTab.vue';
import Loading from './Loading.vue';

type Props = {
    showLoading?: boolean,
    requireUrl?: boolean
}
const props = defineProps<Props>()

const loading = ref(true)
const sourceTab: Ref<browser.tabs.Tab | null> = ref(null)
const sourceIconUrl: Ref<string | null> = ref(null)

const emit = defineEmits(['loaded'])

onBeforeMount(async () => {
    const tab = await loadOpenerTab()
    sourceTab.value = tab
    try{
        sourceIconUrl.value = await callContentApi('getOriginalFaviconUrl', [], tab?.id)
    } catch(e){
        // receiving end does not exist, just log the error
        console.log('During call to content api:', e)
    }
    loading.value = false
    emit('loaded', tab, sourceIconUrl.value)
})

async function updateTabIcon(svg: string) {
    const fromTab = await loadOpenerTab()
    fromTab && callContentApi('setIcon', [svg], fromTab.id)
}

</script>

<template>
    <Loading v-if="loading || props.showLoading" />
    <AlertNoSourceTab v-else-if="sourceTab === null" />
    <v-alert
            v-else-if="!sourceIconUrl && props.requireUrl"
            type="error"
            variant="outlined"
            title="Could not load icon url from source tab"
        />
    <slot
        v-else
        :sourceTab="sourceTab"
        :sourceIconUrl="sourceIconUrl"
        :updateTabIcon="updateTabIcon"
    />
</template>
<style scoped>

</style>
