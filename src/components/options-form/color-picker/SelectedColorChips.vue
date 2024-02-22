<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { RgbColor } from '@image-tracer-ts/core'
import ColorPickerCard from './ColorPickerCard.vue'
import { mdiPlus, mdiDelete } from '@mdi/js'


type Props = {
    unique?: boolean
    noAdd?: boolean
    noClear?: boolean
}
const props = defineProps<Props>()

const colors = defineModel('colors', {default: () => [] as RgbColor[], required: true})
const showPicker = defineModel<boolean>('showPicker')

const isAddOpen = ref(false)
watchEffect(() => showPicker.value !== undefined && (isAddOpen.value = showPicker.value))

const emit = defineEmits<{
    (e: 'doAdd'): void
}>()

function addColor(color: RgbColor) {
    if (props.unique && colors.value.some((existing) => existing.equals(color))) {
        return
    }
    colors.value.concat([color])
}

function removeColor(color: RgbColor, index: number) {
    const colorClone = colors.value.slice()
    colorClone.splice(index, 1)
    colors.value = colorClone
}

function clear() {
    colors.value = []
}

function showAdd(value = true) {
    value && emit('doAdd')
    isAddOpen.value = value
    showPicker.value = value
}
</script>

<template>
    <v-chip-group class="flex-wrap mx-2" column>
        <v-chip
            v-for="(color, ix) in colors"
            :key="color.toInt32()"
            :color="color.toCssColor()"
            class="color-chip"
            variant="elevated"
            closable
            @click:close="removeColor(color, ix)"
        >
            <span
                class="swatch"
                :style="{ backgroundColor: color.toCssColorHex() }"
            />{{
                color.toCssColorHex()
            }}
        </v-chip>
        <v-chip
            v-if="!props.noAdd"
            :prepend-icon="mdiPlus"
            @click="showAdd(!isAddOpen)"
            label
        >
            Pick Color
        </v-chip>
        <v-chip
            v-if="colors.length > 0 && !props.noClear"
            :prepend-icon="mdiDelete"
            @click="clear"
            label
        >
            Clear All
        </v-chip>

        <slot
            v-if="!props.noAdd"
            name="color-adder"
            :isShow="isAddOpen"
            :setShow="showAdd"
            :addColor="addColor"
            :removeColor="removeColor"
            :unique="unique"
            :colors="colors.slice()"
            :updateColors="(v:RgbColor[]) => colors = v"
        >
            <v-dialog
                v-model="isAddOpen"
                content-class="align-center"
            >
                <ColorPickerCard
                    @select-color="addColor"
                    @close="showAdd(false)"
                />
            </v-dialog>
        </slot>
    </v-chip-group>
</template>
<style scoped>
.swatch {
    width: 25px;
    height: 25px;
    margin-right: 4px;
    border: 1px solid #fff;
    border-radius: 13px;
}
</style>
