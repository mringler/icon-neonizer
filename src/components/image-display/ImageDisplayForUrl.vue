<script setup lang="ts">

import { watch, ref, Ref } from 'vue'
import { IconStorage } from '@/scripts/background/storage/icon-storage';
import FaviconImg from './FaviconImg.vue';
import FaviconStored from './FaviconStored.vue';

const { url } = defineProps<{
    url: string
}>()
const newImage: Ref<string | null> = ref(null)

watch(
    () => url,
    loadNewIcon,
    { immediate: true }
)

async function loadNewIcon() {
    newImage.value = await IconStorage.loadIcon(url)
}

</script>

<template>
    <div class="image-row">

        <FaviconImg :src="url" class="image-display-icon"/>
        
        <FaviconStored :url="url" class="image-display-icon" />
        
    </div>

</template>

<style scoped>
.image-row {
    display: flex;
}
.image-display-icon{
    width: 200px;
    height: 200px;
    max-width: 200px;
    max-height: 200px;
}
</style>
