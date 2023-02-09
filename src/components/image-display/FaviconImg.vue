<script setup lang="ts">

import { faviconDownloadUrl } from '@/util/favicon-download-url-filter';
import IconFrame from './IconFrame.vue';
import {ref} from 'vue'

type Props = {
    src: string,
}
const { src } = defineProps<Props>()
const showEmpty = ref(false)
</script>

<template>
    <IconFrame :is-empty="!src">
        <img
            v-if="!showEmpty"
            :src="faviconDownloadUrl(src)"
            class="w-100"
            @error="showEmpty = true"
        />
        <span v-else class="mdi mdi-cloud-question-outline mdi-48px"/>
    </IconFrame>
</template>

<style scoped>

</style>
