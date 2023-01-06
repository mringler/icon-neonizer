<script setup lang="ts">
import { inject, ref, Ref, onBeforeMount, toRaw } from 'vue'
import ImageDisplay from '@/components/ImageDisplay.vue'
import OptionsForm from '@/components/OptionsForm.vue'
import { loadOriginalUrl } from '@/util/content-api';
import { callBackgroundApi } from '@/util/background-api';
import type { Options } from '@image-tracer/core';
import AlertSnackbar from '@/components/AlertSnackbar.vue';
import { ImageLoader } from '@image-tracer/browser';

const sourceTab = inject<Ref<browser.tabs.Tab | null>>('sourceTab')
const options: Ref<Options> = ref({} as Options)
const tracedSvg: Ref<string | null> = ref(null)
const errorMessage: Ref<string | null> = ref(null)

onBeforeMount(async () => {
    options.value = await callBackgroundApi('getOptions', []);
})

const retrace = async () => {
    const url = await loadOriginalUrl(sourceTab?.value)
    if (!url) {
        errorMessage.value = 'Could not read favicon url from source tab'
        return
    }
    console.log(toRaw(options.value))
    tracedSvg.value = await callBackgroundApi('traceWithOptions', [url, toRaw(options.value)])
}

const reset = async () => {
    errorMessage.value = 'nyi'
}

const getOriginalImageData = async (): Promise<ImageData> => {
    const url = await loadOriginalUrl(sourceTab?.value)
    return ImageLoader.loadUrl(url)
}

</script>

<template>

    <ImageDisplay
        :tab="sourceTab"
        v-slot="{ imageDisplayStyle }"
    >
        <div
            v-if="tracedSvg"
            :style="imageDisplayStyle"
            v-html="tracedSvg"
        />
    </ImageDisplay>

    <v-btn
        variant="flat"
        color="primary"
        @click="retrace"
    >reload</v-btn>

    <v-btn
        variant="flat"
        color="plain"
        @click="reset"
    >reset</v-btn>

    <OptionsForm
        v-model:options="options"
        :image-data="getOriginalImageData"
    />

    <AlertSnackbar v-model:message="errorMessage" />

</template>
<style scoped>

</style>
