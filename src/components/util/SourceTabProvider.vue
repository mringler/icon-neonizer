<script setup lang="ts">
import { createSourceTab } from '@/composables/sourceTab';
import { loadOpenerTab } from '@/util/active-tab';
import { callContentApi } from '@/util/content-api-caller';
import AlertNoSourceTab from './AlertNoSourceTab.vue';
import Loading from './Loading.vue';

const props = defineProps<{
    showLoading?: boolean,
    requireUrl?: boolean
}>()
const emit = defineEmits(['loaded'])

const {loading, sourceTab, sourceIconUrl} = createSourceTab( (tab, url) =>  emit('loaded', tab, url))

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
