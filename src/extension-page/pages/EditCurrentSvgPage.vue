<script setup lang="ts">
import { callContentApi } from '@/util/content-api';
import Loading from '@/components/Loading.vue';
import { inject, onBeforeMount, ref, Ref } from 'vue'
import SvgEditor from '@/components/SvgEditor.vue';

const sourceTab = inject<Ref<browser.tabs.Tab | null>>('sourceTab')
const originalUrl: Ref<string | null> = ref(null)
const loading = ref(true)

onBeforeMount(async () => {
    originalUrl.value = await callContentApi('getOriginalFaviconUrl', [], sourceTab?.value)
    loading.value = false
})
</script>

<template>

    <Loading v-if="loading" />
    <SvgEditor
        v-else
        :url="originalUrl as string"
    />

</template>
<style scoped>

</style>
