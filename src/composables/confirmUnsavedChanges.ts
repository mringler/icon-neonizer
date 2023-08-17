import { type Ref, watchEffect, onBeforeUnmount } from 'vue'
import type { ConfirmProps } from '../components/util/Confirmation.vue'
import { type NavigationGuard, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { useConfirmationDialog } from '@/composables/confirmDialog'

export function useConfirmUnsavedChanges(
    hasChange: Ref<boolean>,
    title = 'Leaving page will discard unsaved changes?',
    message = 'Leave page anyway?',
    cancelText = 'Stay',
    confirmText = 'Leave',
) {
    const showConfirm = useConfirmationDialog()

    function buildConfirmPromise(onConfirm?: Function, onCancel?: Function): Promise<boolean> {
        if (!showConfirm) {
            return Promise.resolve(true)
        }
        return new Promise((resolve) => {
            const confirmProps: ConfirmProps = {
                title,
                message,
                cancelText,
                confirmText,
                onConfirm: () => {
                    onConfirm && onConfirm()
                    resolve(true)
                },
                onCancel: () => {
                    onCancel && onCancel()
                    resolve(false)
                },
            }
            showConfirm(confirmProps)
        })
    }

    const warnOfUnsavedChanges: NavigationGuard = async (to, from, next) => {
        if (!hasChange.value || !showConfirm) {
            return next()
        }
        return buildConfirmPromise(next, () => false)
    }
    onBeforeRouteLeave(warnOfUnsavedChanges)
    onBeforeRouteUpdate(warnOfUnsavedChanges)

    watchEffect(() => {
        if (hasChange.value) {
            window.addEventListener('beforeunload', beforeunloadHandler)
        } else {
            window.removeEventListener('beforeunload', beforeunloadHandler)
        }
    })

    function beforeunloadHandler(e: BeforeUnloadEvent) {
        e.preventDefault()
        return (e.returnValue = 'Unsaved changes will be lost. Leave anyway?')
    }

    onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeunloadHandler))
}
