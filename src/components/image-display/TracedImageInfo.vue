<script setup lang="ts">
import FaviconSvg from './FaviconSvg.vue';
import { useTracedSvgInfo } from '@/composables/tracedSvg';
import { toRef } from 'vue';

const props = defineProps<{
    tracedSvg: string | null | undefined,
}>()

const { numberOfGradients, numberOfPaths, sizeKb } = useTracedSvgInfo(toRef(props, 'tracedSvg'))

</script>

<template>
    <div class="traced-image-info">
        <FaviconSvg
            :svg="tracedSvg"
            width="27px"
            height="27px"
            noFrame
        />
        <div
            v-if="tracedSvg"
            class="text-caption ml-2"
        >
            {{ sizeKb }} kB
            / {{ numberOfPaths ?? 'unknown' }} Paths
            / {{ numberOfGradients }} Gradients
        </div>

    </div>
</template>

<style scoped>
.traced-image-info{
    height: 56px;
    display: flex;
    align-items: center;
}
</style>
