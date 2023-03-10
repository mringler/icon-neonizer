<script setup lang="ts">
import { ref, Ref, watch, inject, computed } from 'vue'
import AlertSnackbar from '../util/AlertSnackbar.vue';
import { IconStorage } from '@/scripts/background/storage/icon-storage';
import FaviconSvg from '../image-display/FaviconSvg.vue';
import ConfirmUnsavedChanges from '../util/ConfirmUnsavedChanges.vue';
import type { ConfirmProps } from '../util/Confirmation.vue';

const showConfirm = inject('showConfirm', (props: ConfirmProps) => {})

type Props = {
    url: string,
    svg: string,
    isLocked?: boolean
}
const props = defineProps<Props>()

const originalSvg: Ref<string | null> = ref(null)
const editedSvg: Ref<string | null> = ref(null)
const snackbarMessage = ref<string | null>(null)
const lock = ref(false)

const emit = defineEmits(['update:svg'])

watch(
    () => props.svg,
    () => {
        originalSvg.value = editedSvg.value = props.svg
    },
    { immediate: true }
)

watch(
    () => props.isLocked,
    () => lock.value = Boolean(props.isLocked),
    { immediate: true }
)

const svgHasChanged = computed(() => originalSvg.value !== editedSvg.value)

const reset = () => {
    const confirmProps: ConfirmProps = {
        title: 'Discard changes',
        message: 'This will restore the last saved state. Continue?',
        confirmText: 'Continue',
        onConfirm: () => {
            editedSvg.value = originalSvg.value
        }
    }
    showConfirm(confirmProps)
}

const store = async () => {
    if (!editedSvg.value?.trim()) {
        return;
    }
    await IconStorage.storeIcon(props.url, editedSvg.value, lock.value)
    originalSvg.value = editedSvg.value
    snackbarMessage.value = 'Icon updated'
    emit('update:svg', editedSvg.value)
}
</script>

<template>
    <AlertSnackbar v-model:message="snackbarMessage" />
    <ConfirmUnsavedChanges :no-change="!svgHasChanged" />

    <v-container>
        <v-row>
            <v-col
                cols="12"
                md="9"
                xl="8"
            >

                <v-text-field
                    :value="url"
                    :readonly="true"
                />
                <v-textarea
                    variant="filled"
                    label="Svg Image"
                    auto-grow
                    v-model="editedSvg"
                ></v-textarea>

            </v-col><v-col
                cols="12"
                md="3"
                xl="4"
            >

                <div style="position: sticky; top: 70px;">
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
<style scoped>

</style>
