<script setup lang="ts">

import { faviconDownloadUrl } from '@/util/favicon-download-url-filter';
import IconFrame from './IconFrame.vue';

type Props = {
    src: string,
}
const { src } = defineProps<Props>()

</script>

<template>
    <IconFrame :is-empty="!src">
        <img
            :src="faviconDownloadUrl(src)"
            class="w-100"
            :alt="src"
        />
    </IconFrame>
</template>

<style scoped>

</style>
