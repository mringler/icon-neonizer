<script setup lang="ts">
import type { BlacklistedPage } from '@/scripts/background/storage/blacklist'
import { type Ref, ref, watch, toRaw } from 'vue'

const page = defineModel<BlacklistedPage>('page')
const editedPage: Ref<BlacklistedPage> = ref({ url: '', replacementUrl: '', comment: '' })

const showModal = ref(false)

watch(() => page, resetPage, { immediate: true })

function resetPage() {
    if (!page.value) {
        editedPage.value = { url: '', replacementUrl: '', comment: '' }
        return
    }
    Object.assign(editedPage.value, page.value)
}

function addUrl() {
    page.value = toRaw(editedPage.value)
    close()
}

function close() {
    resetPage()
    showModal.value = false
}
</script>

<template>
    <v-dialog
        v-model="showModal"
        class="blacklist-url-dialog"
    >
        <template v-slot:activator="{ props: activatorProps }">
            <slot
                name="activator"
                :props="activatorProps"
            ></slot>
        </template>
        <v-card>
            <v-card-title>
                <span class="text-h5">Add URL to blacklist</span>
            </v-card-title>
            <v-card-text>
                <v-text-field
                    label="URL Fragment"
                    required
                    v-model="editedPage.url"
                    autofocus
                    @keyup.enter.stop="editedPage.url && addUrl()"
                ></v-text-field>
                <v-text-field
                    label="Replacement URL"
                    v-model="editedPage.replacementUrl"
                    @keyup.enter.stop="editedPage.replacementUrl && editedPage.url && addUrl()"
                ></v-text-field>
                <v-text-field
                    label="Note"
                    v-model="editedPage.comment"
                    @keyup.enter.stop="editedPage.url && addUrl()"
                ></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="secondary"
                    variant="text"
                    @click="close"
                > Cancel </v-btn>
                <v-btn
                    color="primary"
                    variant="outlined"
                    :disabled="!editedPage.url"
                    @click="addUrl"
                >
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<style scoped>
.blacklist-url-dialog {
    max-width: 800px;
}
</style>
