<script setup lang="ts">
import TraceUrlPage from './TraceUrlPage.vue';
import SourceTabProvider from '@/components/SourceTabProvider.vue';
</script>

<template>
    <SourceTabProvider
        v-slot="{ updateTabIcon, sourceIconUrl }"
        require-url
    >
        <TraceUrlPage
            class="ferd"
            :url="sourceIconUrl as string"
            @update:svg="updateTabIcon"
        />
    </SourceTabProvider>
</template>
<style scoped>

</style>
