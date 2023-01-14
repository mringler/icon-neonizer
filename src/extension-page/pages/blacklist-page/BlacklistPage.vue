<script setup lang="ts">
import type { AlertSnackbarProps } from '@/components/AlertSnackbar.vue';
import AlertSnackbar from '@/components/AlertSnackbar.vue';
import Heading from '@/components/Heading.vue';
import { Blacklist, BlacklistedPage } from '@/scripts/background/blacklist';
import { onBeforeMount, Ref, ref, toRaw } from 'vue'
import BlacklistEntryDialog from './BlacklistEntryDialog.vue';


const blacklist: Ref<BlacklistedPage[]> = ref([])
const snackbarInput: Ref<AlertSnackbarProps> = ref({ message: null })
const showAddUrlDialog = ref(false)

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

    <Heading>Edit Blacklist</Heading>

    <p>If a favicon url matches the beginning of an entry in the blacklist, it will not be processed automatically.</p>

    <AlertSnackbar
        v-model:message="snackbarInput.message"
        :color="snackbarInput.color"
    />
    <v-table
        theme="dark"
        class="blacklist-table my-4"
    >
        <thead>
            <tr>
                <th class="text-left w-33">
                    Url fragment
                </th>
                <th class="text-left w-33">
                    Replacement
                </th>
                <th class="text-left w-33">
                    Note
                </th>
                <th class="min-width-fit-content">
                    <BlacklistEntryDialog
                        @update:page="addPage"
                        v-slot:activator="{ props }"
                    >
                        <v-btn
                            color="primary"
                            variant="text"
                            v-bind="props"
                        >
                            Add Url
                        </v-btn>
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
                        @update:page="page => updatePage(ix, page)"
                        v-slot:activator="{ props }"
                    >
                        <v-btn
                            icon
                            variant="flat"
                            v-bind="props"
                        ><v-icon>mdi-pen</v-icon></v-btn>
                    </BlacklistEntryDialog>

                    <v-btn
                        icon
                        variant="flat"
                        @click="removePage(blacklistPage)"
                    ><v-icon>mdi-delete</v-icon></v-btn>
                </td>
            </tr>
            <tr v-if="blacklist?.length === 0">
                <td colspan="2"><v-alert
                        variant="outlined"
                        type="info"
                        class="my-4"
                    >No blacklisted pages.</v-alert></td>
            </tr>
        </tbody>
    </v-table>

</template>
<style scoped>
.blacklist-table {
    max-width: 1000px;
}

.nowrap {
    white-space: nowrap;
}
</style>
