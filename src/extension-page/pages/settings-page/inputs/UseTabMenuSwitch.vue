<script setup lang="ts">
import SettingsInput from './SettingsInput.vue';

</script>

<template>
    <SettingsInput
        heading="Tab context menu"
        card-header="Configure tab context menu"
    >
        <template v-slot:description>
            Put a link to the configuration page into the context (right click)
            menu on tabs. Useful if the extension icon is not available.
        </template>
        <template v-slot:default="{ settings, triggerSettingsReload }">
            <v-switch
                v-model="settings.enableTabMenu"
                label="Add entry to tab context menu"
                color="primary"
                @update:model-value="triggerSettingsReload"
            ></v-switch>
        </template>
    </SettingsInput>
</template>
<style scoped></style>

