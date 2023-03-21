<script setup lang="ts">
import { loadActiveTab } from '@/util/active-tab';
import { onBeforeMount, ref, Ref, computed } from 'vue'
import { loadOriginalUrl as loadOriginalFaviconUrl } from '../util/content-api-caller';
import { Blacklist, BlacklistedPage } from '@/scripts/background/storage/blacklist';
import { IconStorage } from '@/scripts/background/storage/icon-storage';
import FaviconImg from '@/components/image-display/FaviconImg.vue';
import FaviconStored from '@/components/image-display/FaviconStored.vue';

const url: Ref<string | null> = ref(null)
const blacklistEntry: Ref<BlacklistedPage | undefined> = ref()
const newImage: Ref<string | null> = ref(null)

async function loadUrl() {
    const tabUrl = await loadActiveTab().then(tab => tab && loadOriginalFaviconUrl(tab.id))
    if (!tabUrl) {
        return
    }
    blacklistEntry.value = await Blacklist.getBlacklistEntry(tabUrl)
    url.value = blacklistEntry.value?.replacementUrl ?? tabUrl
    newImage.value = await IconStorage.loadIcon(url.value)
}
onBeforeMount(loadUrl)

const blackListNotification = computed(() => blacklistEntry.value?.replacementUrl ?
    { icon: 'mdi-file-replace', text: 'URL was replaced through blacklist' } :
    { icon: '', text: 'No automatic processing: source is blacklisted.' }
)

const openExtensionPage = async () => {
    const tab = await loadActiveTab()
    const createData = {
        url: "/src/extension-page/extension-page.html",
        openerTabId: tab?.id,
    };
    browser.tabs.create(createData);
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
                v-if="blacklistEntry"
                :text="blackListNotification.text"
                v-slot:activator="{ props }"
            >
                <v-icon
                    v-bind="props"
                    class="mr-2"
                    :icon="blackListNotification.icon"
                    color="primary"
                />
            </v-tooltip>
            <span class="wrap-on-hover">{{ url }}</span>
        </v-card-subtitle>

        <v-card-text>
            <div
                v-if="url"
                class="image-row justify-space-between"
            >

                <FaviconImg
                    :src="url"
                    class="image-display-icon"
                />

                <FaviconStored
                    :url="url"
                    class="image-display-icon"
                />

            </div>

        </v-card-text>

        <v-card-actions>
            <v-btn
                block
                variant="tonal"
                color="primary"
                @click="openExtensionPage"
            >Configure</v-btn>
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

.image-row {
    display: flex;
}

.image-display-icon {
    width: 200px;
    height: 200px;
    max-width: 200px;
    max-height: 200px;
}
</style>
