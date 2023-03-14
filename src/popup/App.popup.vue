<script setup lang="ts">
import OpenExtensionPage from '@/components/OpenExtensionPage.vue';
import ImageDisplayForUrl from '@/components/image-display/ImageDisplayForUrl.vue';
import { loadActiveTab } from '@/util/active-tab';
import { onBeforeMount, ref, Ref} from 'vue'
import { loadOriginalUrl as loadOriginalFaviconUrl } from '../util/content-api-caller';
import { Blacklist } from '@/scripts/background/storage/blacklist';

const url: Ref<string | null> = ref(null)
const isBlacklisted = ref(false)

async function loadUrl() {
    const tab = await loadActiveTab()
    if (!tab) {
        return
    }
    url.value = await loadOriginalFaviconUrl(tab.id)
    isBlacklisted.value = await Blacklist.isBlacklisted(url.value)
}
onBeforeMount(loadUrl)


function closePopup() {
    window.close()
}

</script>

<template>

    <v-card
        title="Icon Neonizer"
        class="panel-card ma-3"
    >
        <v-card-subtitle>
            <v-tooltip
                v-if="isBlacklisted"
                text="No automatic processing: source is blacklisted."
                v-slot:activator="{ props }"
            >
                <v-icon
                    v-bind="props"
                    class="mr-2 text-info"
                >mdi-block-helper</v-icon>
            </v-tooltip>
            <span class="wrap-on-hover">{{ url }}</span>            
        </v-card-subtitle>
        <v-card-text>
            <ImageDisplayForUrl
                v-if="url"
                :url="url"
                class="justify-space-between"
            />
        </v-card-text>

        <v-card-actions>
            <OpenExtensionPage
                @opened="closePopup"
                block
                variant="tonal"
            />
        </v-card-actions>

    </v-card>

</template>
<style scoped>
.panel-card {
    border: 1px solid #ff00ff;
    padding: 8px;
    background-color: transparent;
    width: 500px;
}

.wrap-on-hover:hover {
    word-break: break-all;
}
</style>
