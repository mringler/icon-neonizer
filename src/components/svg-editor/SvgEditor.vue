<script setup lang="ts">
import { ref, type Ref, computed, watchEffect } from 'vue'
import AlertSnackbar from '../util/AlertSnackbar.vue'
import { IconStorage } from '@/scripts/background/storage/icon-storage'
import FaviconSvg from '../image-display/FaviconSvg.vue'
import type { ConfirmProps } from '../util/Confirmation.vue'
import { useConfirmationDialog } from '@/composables/confirmDialog'
import { useConfirmUnsavedChanges } from '@/composables/confirmUnsavedChanges'

const props = defineProps<{
    url: string
    isLocked?: boolean
}>()

const svg = defineModel<string>('svg', {required: true})

const originalSvg: Ref<string | undefined> = ref()
const editedSvg: Ref<string | undefined> = ref()
const snackbarMessage = ref<string | null>(null)
const lock = ref(false)

const svgHasChanged = computed(() => originalSvg.value !== editedSvg.value)


const showConfirm = useConfirmationDialog()
useConfirmUnsavedChanges(svgHasChanged)

watchEffect(() => {
    editedSvg.value = svg.value
    originalSvg.value = svg.value
})
watchEffect(() => (lock.value = Boolean(props.isLocked)))


const reset = () => {
    const confirmProps: ConfirmProps = {
        title: 'Discard changes',
        message: 'This will restore the last saved state. Continue?',
        confirmText: 'Continue',
        onConfirm: () => {
            editedSvg.value = originalSvg.value
        },
    }
    showConfirm(confirmProps)
}

const store = async () => {
    if (!editedSvg.value?.trim()) {
        return
    }
    await IconStorage.storeIcon(props.url, editedSvg.value, lock.value)
    originalSvg.value = editedSvg.value
    snackbarMessage.value = 'Icon updated'
    svg.value = editedSvg.value
}
</script>

<template>
    <AlertSnackbar v-model:message="snackbarMessage" />

    <v-container>
        <v-row>
            <v-col
                cols="12"
                md="9"
                xl="8"
            >
                <v-text-field
                    :value="url"
                    readonly
                />
                <v-textarea
                    variant="filled"
                    label="Svg Image"
                    auto-grow
                    v-model="editedSvg"
                ></v-textarea> </v-col><v-col
                cols="12"
                md="3"
                xl="4"
            >
                <div style="position: sticky; top: 70px">
                    <FaviconSvg
                        :svg="editedSvg"
                        class="mb-2"
                    />
                    <FaviconSvg
                        :svg="editedSvg"
                        class="mb-2"
                        width="27px"
                        height="27px"
                        noFrame
                    />

                    <v-btn
                        variant="plain"
                        color="secondary"
                        :disabled="!originalSvg || !svgHasChanged"
                        @click.stop="reset"
                    >
                        Reset
                    </v-btn>
                    <v-btn
                        variant="outlined"
                        color="primary"
                        :disabled="!url || !editedSvg"
                        @click.stop="store"
                    >
                        Save
                    </v-btn>

                    <v-checkbox
                        v-model="lock"
                        :value="true"
                        label="protect from automatic override"
                        hide-details
                    ></v-checkbox>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>
<style scoped></style>
