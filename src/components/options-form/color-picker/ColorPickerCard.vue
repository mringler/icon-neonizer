<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { RgbColor } from '@image-tracer-ts/core'

const colorHex: Ref<string | null> = ref(null)

const emit = defineEmits<{
    (e: 'selectColor', color: RgbColor): void
    (e: 'close'): void
}>()

function emitSelectColor() {
    if (!colorHex.value) {
        return
    }
    const color = RgbColor.fromHex(colorHex.value)
    emit('selectColor', color)
}
</script>

<template>
    <v-card max-width="fit-content">
        <v-card-title>
            <span class="text-h5">Pick Colors</span>
        </v-card-title>
        <v-card-text>
            <v-color-picker v-model="colorHex"></v-color-picker>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="secondary"
                variant="text"
                @click="emit('close')"
            > Close </v-btn>
            <v-btn
                color="primary"
                variant="outlined"
                @click="emitSelectColor"
            > Add </v-btn>
        </v-card-actions>
    </v-card>
</template>
<style scoped></style>
