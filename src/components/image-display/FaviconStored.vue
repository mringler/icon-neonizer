<script setup lang="ts">
import { watch, ref, Ref } from 'vue'
import { IconStorage } from '@/scripts/background/storage/icon-storage';
import FaviconSvg from './FaviconSvg.vue';
import { Blacklist } from '@/scripts/background/storage/blacklist';


type Props = {
    url: string,
    changeAfterLoad?: boolean,
    showIconOnMissing?: boolean,
}
const props = defineProps<Props>()

const svgPromise: Ref<Promise<string | null> | string | null> = ref(null)
const isBlacklisted = ref(false)

watch(
    () => props.url,
    async () => {
        if (!props.url) {
            svgPromise.value = null;
            return
        }
        const promise = IconStorage.loadIcon(props.url)
        svgPromise.value = (props.changeAfterLoad) ? await promise : promise
        isBlacklisted.value = await Blacklist.isBlacklisted(props.url)
    },
    { immediate: true }
)


</script>

<template>
    <FaviconSvg :svg="svgPromise">
        <template
            v-if="!props.showIconOnMissing"
            v-slot:no-content
        >
            <div class="pa-4 text-center">
                No stored icon for
                <v-tooltip
                    :text="url"
                    location="bottom"
                    v-slot:activator="{ props }"
                >
                    <v-btn
                        v-bind="props"
                        variant="text"
                        color="secondary"
                    >url</v-btn>

                    <div v-if="isBlacklisted">(Blacklisted)</div>
                </v-tooltip>
            </div>
        </template>
    </FaviconSvg>
</template>

<style scoped>

</style>
