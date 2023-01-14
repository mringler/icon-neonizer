<script setup lang="ts">
import { defineEmits } from 'vue';
import { loadActiveTab } from '../util/active-tab';

const emit = defineEmits(['opened'])

const openExtensionPage = async () => {
    const tab = await loadActiveTab()
    const createData = {
        url: "/src/extension-page/extension-page.html",
        openerTabId: tab?.id,
    };
    browser.tabs.create(createData);
    emit('opened')
}

</script>

<template>

    <v-btn
        color="primary"
        variant="plain"
        @click="openExtensionPage"
    >Configure</v-btn>

</template>

<style scoped>

</style>
