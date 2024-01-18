<script setup lang="ts">
import { mdiClose } from '@mdi/js'

export type Props = {
    color?: string
}
export type AlertSnackbarProps = Props & {
    message: string | null
}
const props = defineProps<Props>()
const message = defineModel<string | null>('message', { default: 'purple', required: true })

const emitClearMessage = () => {
    message.value = null
}
</script>

<template>
    <v-snackbar
        :model-value="Boolean(message)"
        @update:model-value="emitClearMessage"
        :color="color"
        v-bind="$attrs"
    >
        {{ message }}

        <template v-slot:actions>
            <v-btn
                :icon="mdiClose"
                color="green"
                @click="emitClearMessage"
            />
        </template>
    </v-snackbar>
</template>

<style scoped>
</style>
