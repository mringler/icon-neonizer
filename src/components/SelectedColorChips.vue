<script setup lang="ts">

import { ref, watch } from 'vue'
import type { RgbColor, RgbColorData } from '@image-tracer/core';
import ColorPickerCard from './ColorPickerCard.vue';

type Props = {
    showPicker?: boolean,
    colors: RgbColorData[],
    unique?: boolean,
    noAdd?: boolean,
    noClear?: boolean,
}
const props = withDefaults(defineProps<Props>(), {
    colors: () => [] as RgbColor[],
});

const isAddOpen = ref(false)
watch(
    () => props.showPicker, 
    () => isAddOpen.value = props.showPicker === undefined ? isAddOpen.value : props.showPicker,
    {immediate: true}
)

const emit = defineEmits(['update:colors', 'doAdd', 'update:showPicker'])

function addColor(color: RgbColor) {
    if(props.unique && props.colors.some(existing => existing.equals(color))){
        return
    }
    emit('update:colors', props.colors.concat([color]))
}

function removeColor(color: RgbColor, index: number) {
    const colorClone = props.colors.slice()
    colorClone.splice(index, 1)
    emit('update:colors', colorClone)
}

function clear() {
    emit('update:colors', [])
}

function showAdd(value = true) {
    value && emit('doAdd')
    isAddOpen.value = value
    emit('update:showPicker', value)
}

</script>

<template>
    <v-chip-group class="flex-wrap mx-2">
        <v-chip
            v-for="(color, ix) in props.colors"
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
            />{{ color.toCssColorHex() }}
        </v-chip>
        <v-chip
            v-if="!props.noAdd"
            prepend-icon="mdi-plus"
            @click="showAdd(!isAddOpen)"
            label
        >Pick Color</v-chip>
        <v-chip
            v-if="props.colors.length > 0 && !props.noClear"
            prepend-icon="mdi-delete"
            @click="clear"
            label
        >Clear All</v-chip>

        <slot
            v-if="!props.noAdd"
            name="color-adder"
            :isShow="isAddOpen"
            :setShow="showAdd"
            :addColor="addColor"
            :removeColor="removeColor"
            :unique="unique"
            :colors="colors.slice()"
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
