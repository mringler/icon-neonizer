<script setup lang="ts">

import IconFrame from './IconFrame.vue';
import { ref } from 'vue'
import {useSrcUrl} from '@/composables/srcUrl'
import {useAwaited} from '@/composables/awaited'
import {usePropRef} from '@/composables/propRef'

const props = defineProps<{
    src: string,
}>()

const [processedSrc] = useAwaited(useSrcUrl(usePropRef(props, 'src')))
const showEmpty = ref(false)

</script>

<template>
    <IconFrame :is-empty="!processedSrc">
        <img
            v-if="!showEmpty"
            :src="processedSrc!"
            class="w-100"
            @error="showEmpty = true"
        />
        <span
            v-else
            class="mdi mdi-cloud-question-outline mdi-48px"
        />
    </IconFrame>
</template>

<style scoped></style>
