<script setup lang="ts">
import { ref, type Ref, computed } from 'vue'
import { mdiDownload } from '@mdi/js'

type Props = {
    url: string
    svg: string
}
const props = defineProps<Props>()
const href: Ref<null | string> = ref(null)
const name: Ref<null | string> = ref(null)

function getFileName(urlLike: string): string {
    const hostRegex = /(https?:\/\/)?([^\/]+)/ // everything after https:// before /
    return urlLike.replace(hostRegex, '$2') || 'neonized-icon'
}

const fileName = computed(() => {
    return getFileName(props.url) + '.svg'
})
let didRun = false

function setHref(e: MouseEvent) {
    if (didRun) {
        return
    }
    didRun = true

    href.value = 'data:text/plain;charset=utf-8,' + encodeURIComponent(props.svg)
    name.value = getFileName(props.url)
    const target = e.target as HTMLAnchorElement
    target.click()
}
</script>

<template>
    <v-btn
        class="download-svg"
        tag="a"
        :icon="mdiDownload"
        :href="href!"
        :download="fileName"
        @click="setHref"
    />
</template>
<style scoped>
.download-svg {
    cursor: pointer;
}
</style>
