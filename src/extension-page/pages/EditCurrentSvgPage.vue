<script setup lang="ts">
import SvgEditor from '@/components/svg-editor/SvgEditorFromUrl.vue'
import SourceTabProvider from '@/components/util/SourceTabProvider.vue'
</script>

<template>
    <SourceTabProvider
        v-slot="{ updateTabIcon, sourceIconUrl }"
        requireUrl
    >
        <SvgEditor
            :url="(sourceIconUrl as string)"
            @update:svg="updateTabIcon"
        />
    </SourceTabProvider>
</template>
<style scoped></style>
