<script setup lang="ts">
import { ref, type Ref, toRef, onBeforeMount, toRaw, computed, type ComputedRef } from 'vue'
import OptionsFormCard from '@/components/options-form/OptionsFormCard.vue'
import { callBackgroundApi } from '@/util/background-api-caller'
import AlertSnackbar from '@/components/util/AlertSnackbar.vue'
import { IconStorage } from '@/scripts/background/storage/icon-storage'
import FaviconImg from '@/components/image-display/FaviconImg.vue'
import FaviconSvg from '@/components/image-display/FaviconSvg.vue'
import FaviconStored from '@/components/image-display/FaviconStored.vue'
import Heading from '@/components/util/Heading.vue'
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options'
import { Favicon } from '@/scripts/content/favicon'
import { useImageData } from '@/composables/imageData'
import { useSrcUrl } from '@/composables/srcUrl'
import TracedImageInfo from '@/components/image-display/TracedImageInfo.vue'
import { useTracedSvg } from '@/composables/tracedSvg'
import { mdiAlertCircle } from '@mdi/js'

type Props = {
    url: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'update:svg', svg: string): void
}>()

const options: Ref<GradientDrawerOptions> = ref({} as GradientDrawerOptions)
const tracedSvg: Ref<string | undefined> = ref()
const errorMessage: Ref<string | null> = ref(null)
const saveCount = ref(0)
const useFallback = ref(false)
const imageDataLoader: ComputedRef<() => Promise<ImageData>> = computed(
    () => async () => useImageData(url.value).value!
)
const url = computed(() =>
    useFallback.value
        ? Favicon.getGoogleApiUrl(new URL(props.url).host) + '&passFilter=1'
        : props.url
)

const { svg: storedSvg, reload: reloadStored, blacklistEntry } = useTracedSvg(toRef(props, 'url'))

onBeforeMount(async () => {
    options.value = await callBackgroundApi('getOptions', [])
})

const {srcUrl, isSvg} = useSrcUrl(url.value)

const retrace = async () => {
    try {
        const resolvedUrl = await srcUrl.value
        tracedSvg.value = await callBackgroundApi('traceWithOptions', [
            resolvedUrl,
            toRaw(options.value),
        ])
    } catch (e) {
        errorMessage.value = e as string
        throw e
    }
}

const save = async () => {
    if (!url.value || !tracedSvg.value) {
        errorMessage.value = 'Could not save icon - no url or icon'
        return
    }
    await IconStorage.storeIcon(props.url, tracedSvg.value)
    errorMessage.value = 'Icon updated'
    saveCount.value++
    reloadStored()
    emit('update:svg', tracedSvg.value)
}

const iconCols = {
    cols: 4,
    md: 3,
    xl: 2,
}
</script>

<template>
    <section tag="section">
        <Heading title="Trace Icon" subtitle="Create replacement icon with custom parameters" />

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
                <router-link :to="{ name: 'trace-by-url', params: { url: blacklistEntry.replacementUrl } }">Trace
                    replacement icon instead.</router-link>
            </template>
            <template v-else>Icon is blacklisted and will not be replaced.</template>
        </v-alert>

        <v-container>
            <v-row class="icon-row">
                <v-col v-bind="iconCols">
                    <div class="text-subtitle-1">Source Icon</div>

                    <FaviconImg :src="url" />
                    <div class="d-flex align-center">
                        <FaviconImg
                            :src="url"
                            width="27px"
                            height="27px"
                            noFrame
                        />

                        <v-checkbox
                            label="use fallback url"
                            v-model="useFallback"
                            hideDetails
                        />
                    </div>
                </v-col>

                <v-col v-bind="iconCols">
                    <div class="text-subtitle-1">Stored Icon</div>

                    <FaviconStored
                        :url="props.url"
                        :key="saveCount"
                        changeAfterLoad
                    />
                    <TracedImageInfo
                        :tracedSvg="storedSvg"
                        :key="saveCount"
                    />
                </v-col>

                <v-col v-bind="iconCols">
                    <div class="text-subtitle-1">Traced Icon</div>

                    <FaviconSvg :svg="tracedSvg">
                        <template v-slot:no-content>Press trace button</template>
                    </FaviconSvg>

                    <TracedImageInfo :tracedSvg="tracedSvg" />
                </v-col>
            </v-row>

            <OptionsFormCard
                v-model:options="options"
                :image-data="imageDataLoader"
                :isSvg="isSvg"
            >
                <template v-slot:toolbar-center>
                    <v-btn
                        variant="flat"
                        color="primary"
                        @click="retrace"
                    >trace</v-btn>

                    <v-btn
                        :disabled="!tracedSvg"
                        @click="save"
                    >save</v-btn>

                    <v-btn
                        :disabled="!tracedSvg"
                        :to="
                            tracedSvg
                                ? { name: 'edit-svg', params: { svg: tracedSvg, url: props.url } }
                                : {}
                        "
                    >edit</v-btn>
                </template>
            </OptionsFormCard>
        </v-container>
    </section>

    <AlertSnackbar v-model:message="errorMessage" />
</template>
<style scoped></style>
