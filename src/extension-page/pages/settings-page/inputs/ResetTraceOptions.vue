<script setup lang="ts">
import { useConfirmationDialog } from '@/composables/confirmDialog'
import { IconStorage } from '@/scripts/background/storage/icon-storage';
import SettingsInput from './SettingsInput.vue';
import { useTracerOptionsDiff } from '../composables/tracerOptionsDiff'
import { mdiBroom, mdiStar } from '@mdi/js'

const { tracerOptionsDiff, loading, reloadDiff } = useTracerOptionsDiff()

const resetPresetOptions = useConfirmationDialog({
    title: 'Restore tracer preset options',
    message: 'This will discard currently stored options',
    confirmText: 'restore',
    onConfirm: () => IconStorage.removeOptions().then(reloadDiff)
})


</script>

<template>
    <SettingsInput
        heading="Custom trace options"
        card-header="Customized options"
    >
        <template #description>
            The trace options used when icons are processed in the background can be
            changed on the trace icon page (look for the <v-icon
                :icon="mdiStar"
                size="x-small"
            /> icon).
        </template>
        <template #default="{ settings }">

            <template v-if="!loading">
                <div
                    v-if="tracerOptionsDiff.length === 0"
                    class="font-weight-bold"
                >Using preset options</div>
                <div v-else>
                    <v-table density="compact">
                        <thead>
                            <tr>
                                <th>Flag</th>
                                <th>Current Value</th>
                                <th>Preset Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="diff in tracerOptionsDiff"
                                :key="diff.property"
                            >
                                <td>{{ diff.property }}</td>
                                <td>{{ diff.value }}</td>
                                <td>{{ diff.default }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>

            </template>

            <div class="py-5">
                <v-btn
                    color="medium-emphasis"
                    variant="outlined"
                    :prepend-icon="mdiBroom"
                    :disabled="tracerOptionsDiff.length === 0"
                    @click="resetPresetOptions"
                >Restore preset</v-btn>
            </div>

        </template>

    </SettingsInput>
</template>
<style scoped></style>

