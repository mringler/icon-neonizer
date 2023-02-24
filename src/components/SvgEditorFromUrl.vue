<script setup lang="ts">
import { ref, Ref, watch } from 'vue'
import Heading from '@/components/Heading.vue';
import { IconStorage } from '@/scripts/background/storage/icon-storage';
import SvgEditor from './SvgEditor.vue';

type Props = {
    url: string,
    isLocked?: boolean
}
const props = defineProps<Props>()

const svg: Ref<string | null> = ref(null)
const loading = ref(true)

watch(
    () => props.url,
    async () => {
        loading.value = true
        svg.value = await IconStorage.loadIcon(props.url)
        loading.value = false
    },
    { immediate: true })

</script>

<template>
    <Loading v-if="loading" />
    <section
        v-else
        tag="section"
    >
        <Heading>Edit SVG</Heading>

        <p>Manually edit the replacement icon SVG.</p>
        
        <SvgEditor
            :url="props.url"
            :is-locked="props.isLocked"
            :svg="svg!"
            v-bind="$attrs"
        />
    </section>

</template>
<style scoped>

</style>
