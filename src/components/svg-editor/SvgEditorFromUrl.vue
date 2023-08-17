<script setup lang="ts">
import { ref, type Ref, watchEffect } from 'vue'
import Heading from '@/components/util/Heading.vue'
import { IconStorage } from '@/scripts/background/storage/icon-storage'
import SvgEditor from './SvgEditor.vue'
import { useLoadingIndicator } from '@/composables/loadingIndicator'
import { Blacklist, type BlacklistedPage } from '@/scripts/background/storage/blacklist'
import { mdiAlertCircle } from '@mdi/js'

const props = defineProps<{
    url: string
    isLocked?: boolean
}>()

const svg: Ref<string | null> = ref(null)
const blacklistEntry: Ref<BlacklistedPage | undefined> = ref(undefined)
const { loading, indicateLoading } = useLoadingIndicator()

watchEffect(async () => {
    indicateLoading(async () => (svg.value = await IconStorage.loadIcon(props.url)))
    blacklistEntry.value = await Blacklist.getBlacklistEntry(props.url)
})
</script>

<template>
    <section
        tag="section"
        v-if="!loading"
    >
        <Heading title="Edit SVG" subtitle="Manually edit the replacement icon SVG"/>

        <v-alert
            v-if="blacklistEntry"
            class="my-3"
            :icon="mdiAlertCircle"
            :title="blacklistEntry.replacementUrl ? 'Redirected URL' : 'Blacklisted URL'"
            type="warning"
            variant="outlined"
        >
            <template v-if="blacklistEntry.replacementUrl">
                Icon is blacklisted and replaced by another URL.
                <router-link :to="{ name: 'edit-by-url', params: { url: blacklistEntry.replacementUrl } }">Edit replacement
                    icon instead.</router-link>
            </template>
            <template v-else>Icon is blacklisted and will not be replaced.</template>
        </v-alert>

        <SvgEditor
            :url="props.url"
            :is-locked="props.isLocked"
            :svg="svg!"
            v-bind="$attrs"
        />
    </section>
</template>
<style scoped></style>
