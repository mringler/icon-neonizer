<script setup lang="ts">
import { ref, Ref, watch, watchEffect } from 'vue'
import Heading from '@/components/util/Heading.vue';
import { IconStorage } from '@/scripts/background/storage/icon-storage';
import SvgEditor from './SvgEditor.vue';

type Props = {
    url: string,
    isLocked?: boolean
}
const props = defineProps<Props>()

const svg: Ref<string | null> = ref(null)
const loading = ref(true)

watchEffect(async () => {
    loading.value = true
    svg.value = await IconStorage.loadIcon(props.url)
    loading.value = false
})

</script>

<template>
    <Loading v-if="loading" />
    <section
        v-else
        tag="section"
    >
        <Heading>Edit SVG</Heading>

        <div class="text-subtitle-1">Manually edit the replacement icon SVG.</div>

        <SvgEditor
            :url="props.url"
            :is-locked="props.isLocked"
            :svg="svg!"
            v-bind="$attrs"
        />
    </section>
</template>
<style scoped></style>
