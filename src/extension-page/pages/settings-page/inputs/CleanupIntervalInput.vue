<script setup lang="ts">
import { useConfirmationDialog } from '@/composables/confirmDialog';
import SettingsInput from './SettingsInput.vue';
import type { Settings } from '@/scripts/background/storage/Settings';
import { mdiBroom } from '@mdi/js'

const showConfirm = useConfirmationDialog()

const cleanup = (settings: Settings) => {
    showConfirm({
        title: 'Cleanup storage',
        message: `This will permanently remove icons that have not been used for ${settings.cleanupIntervalDays} days`,
        confirmText: 'remove',
        onConfirm: () => settings.runCleanup()
    })
}

</script>

<template>
    <SettingsInput
        heading="Storage Cleanup"
        description="
        Unused icons are removed from storage after a number of days.
        Cleanup is performed on Browser startup.
        To exclude icons from cleanup, mark them as locked in the edit view.
        "
        card-header="Update storage period for unused icons"
        v-slot:default="{ settings }"
    >
        <v-text-field
            variant="outlined"
            label="Storage period"
            type="number"
            v-model="settings.cleanupIntervalDays"
            required
            min="0"
            max="30"
        >
            <template v-slot:append-inner>Days</template>
        </v-text-field>

        <v-divider />

        <div class="py-5">
            <v-btn
                color="medium-emphasis"
                variant="outlined"
                :prepend-icon="mdiBroom"
                @click="() => cleanup(settings)"
            >Cleanup now</v-btn>
        </div>
    </SettingsInput></template>
<style scoped></style>
