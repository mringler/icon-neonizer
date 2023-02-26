<script setup lang="ts">
import { ref, Ref, onBeforeMount, toRaw, computed, ComputedRef } from 'vue'
import OptionsForm from '@/components/options-form/OptionsForm.vue'
import { callBackgroundApi } from '@/util/background-api';
import AlertSnackbar from '@/components/util/AlertSnackbar.vue';
import { ImageLoader } from '@image-tracer/browser';
import { IconStorage } from '@/scripts/background/storage/icon-storage';
import { faviconDownloadUrl } from '@/util/favicon-download-url-filter';
import FaviconImg from '@/components/image-display/FaviconImg.vue';
import FaviconSvg from '@/components/image-display/FaviconSvg.vue';
import FaviconStored from '@/components/image-display/FaviconStored.vue';
import Heading from '@/components/util/Heading.vue';
import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options';
import { Favicon } from '@/scripts/content/favicon';

type Props = {
    url: string
}
const props = defineProps<Props>()

const options: Ref<GradientDrawerOptions> = ref({} as GradientDrawerOptions)
const tracedSvg: Ref<string | null> = ref(null)
const errorMessage: Ref<string | null> = ref(null)
const saveCount = ref(0)

const emit = defineEmits(['update:svg'])

onBeforeMount(async () => {
    options.value = await callBackgroundApi('getOptions', []);
})

const retrace = async () => {
    tracedSvg.value = await callBackgroundApi('traceWithOptions', [url.value, toRaw(options.value)])
}

const url = computed(() => useFallback.value ? Favicon.getGoogleApiUrl(new URL(props.url).host) + '&passFilter=1' : props.url )

const imageDataLoader: ComputedRef<() => Promise<ImageData>> = computed(() => () => {
    const sourceUrl = faviconDownloadUrl(url.value)
    return ImageLoader.loadUrl(sourceUrl)
})

const save = async () => {
    if (!url || !tracedSvg.value) {
        errorMessage.value = 'Could not save icon - no url or icon';
        return
    }
    IconStorage.storeIcon(props.url, tracedSvg.value)
    errorMessage.value = 'Icon updated';
    saveCount.value++
    emit('update:svg', tracedSvg.value)
}

async function storeOptions() {
    IconStorage.storeOptions(toRaw(options.value))
}

const useFallback = ref(false)

const iconCols = {
    cols: 4,
    md: 3,
    xl: 2,
}

</script>

<template>
    <section tag="section">
        <Heading>Trace Icon</Heading>

        <v-container>
            <v-row class="icon-row">

                <v-col v-bind="iconCols">

                    <FaviconSvg :svg="tracedSvg">
                        <template v-slot:no-content>trace image output</template>
                    </FaviconSvg>
                    <FaviconSvg
                        :svg="tracedSvg"
                        width="27px"
                        height="27px"
                        noFrame
                    />

                    <div class="mt-3">
                        <v-btn
                        variant="flat"
                        color="primary"
                        @click="retrace"
                        >trace</v-btn>
                        
                        <v-btn
                        :disabled="!tracedSvg"
                        variant="flat"
                        @click="save"
                        >save</v-btn>
                        
                        <v-btn
                        :disabled="!tracedSvg"
                        variant="flat"
                        :to=" tracedSvg ? { name: 'edit-svg', params: { svg: tracedSvg, url: props.url } } : {}"
                        >edit</v-btn>

                    </div>
                </v-col>

                <v-col v-bind="iconCols">

                    <FaviconImg :src="url" />
                    <FaviconImg
                        :src="url"
                        width="27px"
                        height="27px"
                        noFrame
                    />

                    <v-checkbox label="use fallback" v-model="useFallback" hideDetails/>
                </v-col>
                <v-col v-bind="iconCols">

                    <FaviconStored
                        :url="props.url"
                        :key="saveCount"
                        changeAfterLoad
                    />
                    <FaviconStored
                        :url="props.url"
                        :key="saveCount"
                        width="27px"
                        height="27px"
                        noFrame
                        showIconOnMissing
                    />
                </v-col>
            </v-row>
        </v-container>

        <OptionsForm
            v-model:options="options"
            :image-data="imageDataLoader"
        />

    </section>

    <v-btn
        variant="flat"
        @click="storeOptions"
    >store options</v-btn>

    <AlertSnackbar v-model:message="errorMessage" />

</template>
<style scoped>

</style>
