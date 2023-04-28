<script setup lang="ts">

const props = defineProps<{
    title: string
    subtitle?: string
    subtitleClass?: string | string[]
}>()
</script>

<template>
    <div class="text-center mb-4">
        <h1 class="text-h4 mb-2">{{ title }}</h1>
        <div
            v-if="subtitle || $slots.subtitle"
            class="text-subtitle-1"
            :class="subtitleClass"
        >
            <slot name="subtitle">{{ subtitle }}</slot>
        </div>
    </div>
</template>
<style scoped></style>
