<script setup lang="ts">
import IconFrame from './IconFrame.vue'
import { watch, ref, Ref } from 'vue'

type Props = {
    svg: string | null | undefined | Promise<string | null>
}
const props = defineProps<Props>()

const svgContent: Ref<string | null> = ref(null)
const isLoading = ref(false)
watch(
    () => props.svg,
    async () => {
        isLoading.value = true
        svgContent.value = props.svg ? await props.svg : null
        isLoading.value = false
    },
    { immediate: true }
)
</script>

<template>
    <IconFrame
        :isEmpty="svgContent === null"
        :isLoading="isLoading"
    >
        <div
            v-html="svgContent"
            class="w-100 h-100"
        />
        <template
            v-for="(_, name) in $slots"
            v-slot:[name]="slotData"
        >
            <slot
                :name="name"
                v-bind="slotData"
            />
        </template>
    </IconFrame>
</template>

<style scoped></style>
