<script setup lang="ts">
export type AlertSnackbarProps = {
    color?: string
    message: string | null
}
const props = withDefaults(defineProps<AlertSnackbarProps>(), {
    color: 'purple',
})

const emit = defineEmits(['update:message'])
const emitClearMessage = () => {
    emit('update:message', null)
}
</script>

<template>
    <v-snackbar
        :model-value="Boolean(props.message)"
        @update:model-value="emitClearMessage"
        :color="color"
        v-bind="$attrs"
    >
        {{ props.message }}

        <template v-slot:action="{ attrs }">
            <v-btn
                v-bind="attrs"
                icon="mdi-close"
                color="green"
                @click="emitClearMessage"
            />
        </template>
    </v-snackbar>
</template>

<style scoped></style>
