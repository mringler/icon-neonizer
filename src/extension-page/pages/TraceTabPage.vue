<script setup lang="ts">
import TraceUrlPage from './TraceUrlPage.vue'
import SourceTabProvider from '@/components/util/SourceTabProvider.vue'
</script>

<template>
    <SourceTabProvider
        v-slot="{ updateTabIcon, sourceIconUrl }"
        require-url
    >
        <TraceUrlPage
            :url="sourceIconUrl as string"
            @update:svg="updateTabIcon"
        />
    </SourceTabProvider>
</template>
<style scoped></style>
