<script setup lang="ts">
import { ref, Ref, watchEffect, onBeforeUnmount } from 'vue'
import type { ConfirmProps } from './Confirmation.vue';
import { NavigationGuard, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import {useConfirmationDialog} from '@/composables/confirmDialog'

const showConfirm = useConfirmationDialog()

type Props = {
    noChange: boolean,
    title?: string,
    message?: string,
    cancelText?: string
    confirmText?: string
}
const props = withDefaults(defineProps<Props>(), {
    title: 'Leaving page will discard unsaved changes?',
    message: 'Leave page anyway?',
    cancelText: 'Stay',
    confirmText: 'Leave',
})

function buildConfirmPromise(onConfirm?: Function, onCancel?: Function): Promise<boolean> {
    if (!showConfirm) {
        return Promise.resolve(true);
    }
    return new Promise((resolve) => {
        const confirmProps: ConfirmProps = {
            title: props.title,
            message: props.message,
            cancelText: props.cancelText,
            confirmText: props.confirmText,
            onConfirm: () => {
                onConfirm && onConfirm()
                resolve(true)
            },
            onCancel: () => {
                onCancel && onCancel()
                resolve(false)
            }
        }
        showConfirm(confirmProps)
    })
}

const warnOfUnsavedChanges: NavigationGuard = async (to, from, next) => {
    if (props.noChange || !showConfirm) {
        return next()
    }
    return buildConfirmPromise(next, () => false)
}
onBeforeRouteLeave(warnOfUnsavedChanges)
onBeforeRouteUpdate(warnOfUnsavedChanges)

watchEffect(() => {
    if (props.noChange) {
        window.removeEventListener('beforeunload', beforeunloadHandler);
    } else {
        window.addEventListener('beforeunload', beforeunloadHandler);
    }
}
)

function beforeunloadHandler(e: BeforeUnloadEvent) {
    e.preventDefault()
    return e.returnValue = 'Unsaved changes will be lost. Leave anyway?'
}

onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeunloadHandler))

</script>

<template></template>
<style scoped></style>
