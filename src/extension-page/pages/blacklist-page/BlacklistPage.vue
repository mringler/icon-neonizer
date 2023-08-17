<script setup lang="ts">
import Heading from '@/components/util/Heading.vue'
import { Blacklist, type BlacklistedPage } from '@/scripts/background/storage/blacklist'
import { onBeforeMount, type Ref, ref, toRaw } from 'vue'
import BlacklistEntryDialog from './BlacklistEntryDialog.vue'
import { mdiPen, mdiDelete } from '@mdi/js'

const blacklist: Ref<BlacklistedPage[]> = ref([])

onBeforeMount(loadBlacklist)

async function loadBlacklist() {
    blacklist.value = await Blacklist.loadBlacklist()
}

async function addPage(page: BlacklistedPage) {
    await Blacklist.addPageToBlacklist(page)
    loadBlacklist()
}

async function removePage(page: BlacklistedPage) {
    await Blacklist.removePageFromBlacklist(page)
    loadBlacklist()
}
async function updatePage(ix: number, blacklistPage: BlacklistedPage) {
    Object.assign(blacklist.value[ix], blacklistPage)
    return Blacklist.storeBlacklist(toRaw(blacklist.value))
}
</script>

<template>
    <Heading
        title="Edit Blacklist"
        subtitle="Set rules for URLs that need special handling"
    />

    <div class="d-flex flex-column align-center">

        <div>
            <div class="my-8 text-max-width">
                If a favicon url matches the beginning of an entry in the blacklist, it will not be
                processed automatically or replaced by a different icon if a replacement URL is given.
            </div>

            <v-table
                theme="dark"
                class="blacklist-table my-4"
            >
                <thead>
                    <tr>
                        <th class="text-left w-33">URL fragment</th>
                        <th class="text-left w-33">Replacement</th>
                        <th class="text-left w-33">Note</th>
                        <th class="min-width-fit-content">
                            <BlacklistEntryDialog @update:page="addPage">
                                <template v-slot:activator="{ props }">
                                    <v-btn
                                        color="primary"
                                        variant="text"
                                        v-bind="props"
                                    > Add Url </v-btn>
                                </template>
                            </BlacklistEntryDialog>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(blacklistPage, ix) in blacklist"
                        :key="blacklistPage.url"
                    >
                        <td>
                            {{ blacklistPage.url }}
                        </td>
                        <td>
                            {{ blacklistPage.replacementUrl }}
                        </td>
                        <td>
                            {{ blacklistPage.comment }}
                        </td>
                        <td class="nowrap">
                            <BlacklistEntryDialog
                                :page="blacklistPage"
                                @update:page="(page) => updatePage(ix, page)"
                            >
                                <template v-slot:activator="{ props: modalProps }">
                                    <v-tooltip text="Edit">
                                        <template v-slot:activator="{ props: tooltipProps }">
                                            <v-btn
                                                v-bind="{ ...tooltipProps, ...modalProps }"
                                                variant="flat"
                                                :icon="mdiPen"
                                            />
                                        </template>
                                    </v-tooltip>
                                </template>
                            </BlacklistEntryDialog>

                            <v-tooltip text="Delete">
                                <template v-slot:activator="{ props }">
                                    <v-btn
                                        v-bind="props"
                                        :icon="mdiDelete"
                                        variant="flat"
                                        @click="removePage(blacklistPage)"
                                    />
                                </template>
                            </v-tooltip>
                        </td>
                    </tr>
                    <tr v-if="blacklist?.length === 0">
                        <td colspan="4">
                            <v-alert
                                variant="outlined"
                                type="info"
                                class="my-4"
                            >No blacklisted pages.</v-alert>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </div>
    </div>
</template>
<style scoped>
.blacklist-table {
    max-width: 1000px;
}

.nowrap {
    white-space: nowrap;
}
</style>
