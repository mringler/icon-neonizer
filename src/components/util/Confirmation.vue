<script setup lang="ts">
export interface ConfirmProps {
    title?: string
    message?: string
    onCancel?: Function
    onConfirm?: Function
    confirmText?: string
    cancelText?: string
}

const props = withDefaults(defineProps<ConfirmProps>(), {
    cancelText: 'cancel',
    confirmText: 'confirm',
})

const showConfirm = defineModel<boolean>('showConfirm', { required: true })

function emitClose() {
    showConfirm.value = false
}
function cancel() {
    props.onCancel && props.onCancel()
    emitClose()
}

function confirm() {
    props.onConfirm && props.onConfirm()
    emitClose()
}
</script>

<template>
    <v-dialog
        v-model="showConfirm"
        persistent
    >
        <template v-slot:activator="{ props }">
            <slot
                name="activator"
                v-bind="props"
            />
        </template>
        <v-card
            class="align-self-center"
            style="width: fit-content"
            :title="props.title"
            :text="props.message"
        >
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="secondary"
                    variant="text"
                    @click="cancel"
                >
                    {{ props.cancelText }}
                </v-btn>
                <v-btn
                    color="primary"
                    variant="text"
                    @click="confirm"
                >
                    {{ props.confirmText }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
</style>
