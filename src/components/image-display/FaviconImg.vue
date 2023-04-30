<script setup lang="ts">
import IconFrame from './IconFrame.vue'
import { ref, toRef } from 'vue'
import { useSrcUrl } from '@/composables/srcUrl'
import { useAwaited } from '@/composables/awaited'
import { mdiCloudQuestionOutline } from '@mdi/js'

const props = defineProps<{
    src: string
}>()

const [processedSrc] = useAwaited(useSrcUrl(toRef(props, 'src')).srcUrl)
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
        <v-icon v-else :icon="mdiCloudQuestionOutline" size="large"/>
    </IconFrame>
</template>

<style scoped></style>
