<script setup lang="ts">
import type { BlacklistedPage } from '@/scripts/background/storage/blacklist'
import { Ref, ref, watch, toRaw } from 'vue'

type Props = {
    page?: BlacklistedPage
}
const props = defineProps<Props>()

const page: Ref<BlacklistedPage> = ref({ url: '', replacementUrl: '', comment: '' })
const showModal = ref(false)

watch(() => props.page, resetPage, { immediate: true })

const emit = defineEmits<{
    (e: 'update:page', page: BlacklistedPage): void
}>()

function resetPage() {
    if (!props.page) {
        page.value = { url: '', replacementUrl: '', comment: '' }
        return
    }
    Object.assign(page.value, props.page)
}

function addUrl() {
    emit('update:page', toRaw(page.value))
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
                    v-model="page.url"
                    autofocus
                    @keyup.enter.stop="page.url && addUrl()"
                ></v-text-field>
                <v-text-field
                    label="Replacement URL"
                    v-model="page.replacementUrl"
                    @keyup.enter.stop="page.replacementUrl && page.url && addUrl()"
                ></v-text-field>
                <v-text-field
                    label="Note"
                    v-model="page.comment"
                    @keyup.enter.stop="page.url && addUrl()"
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
                    :disabled="!page.url"
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
