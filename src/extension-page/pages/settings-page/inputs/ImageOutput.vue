<script setup lang="ts">
import type { OutputSettings } from '@/scripts/background/storage/Settings';
import SettingsInput from './SettingsInput.vue';


const formatOptions: { label: string, value: OutputSettings['format'] }[] = [
    { label: 'SVG', value: 'svg' },
    { label: 'PNG', value: 'png' },
    //{ label: ''}
]

</script>

<template>
    <SettingsInput
        heading="Image format"
        description="Configure replacement icon image format"
    >

        <template v-slot:default="{ settings, triggerSettingsReload }">


            <v-radio-group
                color="primary"
                v-model="settings.output.format"
                @input="triggerSettingsReload"
            >
                <template v-slot:label>
                    <legend>Image format:</legend>
                </template>
                <v-radio
                    v-for="option in formatOptions"
                    :key="option.label"
                    v-bind="option"
                />
            </v-radio-group>

            <v-divider class="mb-8"></v-divider>

            <v-text-field
                variant="outlined"
                label="Image width (pixels)"
                type="number"
                v-model="settings.output.pngWidth"
                :required="settings.output.format !== 'svg'"
                :disabled="settings.output.format === 'svg'"
                min="16"
                max="128"
                @input="triggerSettingsReload"
            />
        </template>
    </SettingsInput>
</template>
<style scoped>
</style>
