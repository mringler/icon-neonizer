import { ref, inject, provide } from 'vue'
import type { InjectionKey, Ref } from 'vue'
import type { ConfirmProps } from '@/components/util/Confirmation.vue'

const ConfirmationDialogSymbol: InjectionKey<(props: ConfirmProps) => void> =
    Symbol.for('inp:confirm-dialog')

export function createConfirmationDialog() {
    const confirmProps: Ref<ConfirmProps | null> = ref(null)
    const showConfirm = (props: ConfirmProps) => (confirmProps.value = props)
    provide(ConfirmationDialogSymbol, showConfirm)
    return confirmProps
}

export function useConfirmationDialog(confirmProps: ConfirmProps): () => void;
export function useConfirmationDialog(): (confirmProps: ConfirmProps) => void;
export function useConfirmationDialog(confirmProps?: ConfirmProps) {
    const showDialog = inject(ConfirmationDialogSymbol)

    if (!showDialog) throw new Error('Failed to inject ConfirmationDialog!')

    return confirmProps ? () => showDialog(confirmProps) : showDialog
}
