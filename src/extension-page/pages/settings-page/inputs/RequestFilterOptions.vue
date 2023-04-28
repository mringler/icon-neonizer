<script setup lang="ts">
import SettingsInput from './SettingsInput.vue';
import { FaviconRequestFilterType } from '@/scripts/background/request-filter/FaviconRequestFilterType';


const filterOptions: { label: string, value: any }[] = [
    { label: 'only when necessary', value: FaviconRequestFilterType.fallback },
    { label: 'whenever possible (recommended)', value: FaviconRequestFilterType.byName },
]

</script>

<template>
    <SettingsInput
        heading="Response replacement"
    >
    <template v-slot:description>
        Per default, Favicons are replaced by changing the URL provided in the original page.
        When no URL is provided, the request loading the favicon is changed to return the replacement icon.
        The same mechanism can be used to replace icons declared via URL, which gives a more seamless
        experience, but can fail in some specific cases.

        Similarly, touch icons
    </template>
        <template v-slot:default="{ settings, triggerSettingsReload }">


            <v-radio-group
                color="primary"
                v-model="settings.faviconRequestFilter"
                @update:model-value="triggerSettingsReload"
            >
                <template v-slot:label>
                    <legend>Replace favicons in response rather than in tag:</legend>
                </template>
                <v-radio
                    v-for="option in filterOptions"
                    :key="option.label"
                    v-bind="option"
                />
            </v-radio-group>

            <v-divider></v-divider>
            <v-switch
                v-model="settings.filterTouchIcon"
                label="Replace touch icons (experimental)"
                color="primary"
                @update:model-value="triggerSettingsReload"
            ></v-switch>

        </template>
    </SettingsInput>
</template>
<style scoped></style>

