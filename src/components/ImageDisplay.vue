<script setup lang="ts">

import { CSSProperties, onBeforeMount, ref, Ref} from 'vue'
import { callContentApi, loadOriginalUrl as loadOriginalFaviconUrl } from '../util/content-api';
import { loadActiveTab } from '../util/active-tab';

type Props = {
    tab?: browser.tabs.Tab|null
}
const props = defineProps<Props>()

const oldUrl: Ref<string|null> = ref(null)
const newImage: Ref<string|null> = ref(null)

const loadIcons = async () => {
    newImage.value = await loadFavicon()
    oldUrl.value = await loadOriginalFaviconUrl(props.tab)
}

const loadFavicon = async () => {
    const contentIcon = await callContentApi('getCurrentFaviconData', [], props.tab)
    if (contentIcon) {
        return contentIcon
    }
    const tab = props.tab ?? await loadActiveTab()
    return tab?.favIconUrl ?? null
}

onBeforeMount(loadIcons)


const imageDisplayStyle: CSSProperties = {
    height: '200px',
    width: '200px',
    border: '2px solid rgb(143, 143, 143)',
}

</script>

<template>
    <div class="image-row">
        <img :style="imageDisplayStyle" :src="oldUrl || undefined" />
        <img :style="imageDisplayStyle" :src="newImage || undefined" />
        <slot :imageDisplayStyle="imageDisplayStyle"/>
    </div>

    <v-btn
        icon="mdi-sync"
        color="primary"
        variant="plain"
        @click="loadIcons"
    ></v-btn>

</template>

<style scoped>
.image-row {
    display: flex;
    justify-content: space-around;
}

</style>
