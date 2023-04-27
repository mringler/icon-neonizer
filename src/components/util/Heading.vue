<script setup lang="ts">

const props = defineProps<{
    title: string
    subtitle?: string
}>()
</script>

<template>
    <div class="text-center mb-4">
        <h1 class="text-h4 mb-2">{{ title }}</h1>
        <div
            v-if="subtitle"
            class="text-subtitle-1"
        >{{ subtitle }}</div>
    </div>
</template>
<style scoped></style>
