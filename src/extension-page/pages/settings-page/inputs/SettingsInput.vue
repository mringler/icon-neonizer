<script setup lang="ts">

import Heading from '@/components/util/Heading.vue'
import { useSettings } from '../composables/settings'
import { callBackgroundApi } from '@/util/background-api-caller'
const { settings } = useSettings()
const props = defineProps<{
    heading: string
    description?: string
    cardHeader?: string
    onSave?: () => void
}>()

const triggerSettingsReload = () => callBackgroundApi('reloadSettings', [])

</script>

<template>
    <div
        class="mx-auto d-flex flex-column "
        :style="{ maxWidth: '624px' }"
        v-if="settings"
    >
        <Heading
            :title="heading"
            :subtitle="description"
            subtitle-class="my-8 text-start text-max-width"
        >
            <template
                v-if="$slots.description"
                v-slot:subtitle
            >
                <slot name="description" />
            </template>
        </Heading>


        <v-card
            variant="outlined"
            :subtitle="cardHeader"
            
        >
            <v-card-text>
                <slot :settings="settings" :triggerSettingsReload="triggerSettingsReload"/>
            </v-card-text>

            <v-card-actions
                v-if="$slots.buttons || props.onSave"
                class="justify-end"
            >
                <slot name="buttons">
                    <v-btn>Cancel</v-btn>
                    <v-btn
                        color="primary"
                        variant="outlined"
                    >Save</v-btn>
                </slot>
            </v-card-actions>

        </v-card>
        <div class="d-flex justify-end my-8">
            <v-btn
                variant="plain"
                :active="false"
                :to="{ name: 'settings' }"
            >Back to Settings</v-btn>
        </div>
    </div>
</template>
<style scoped></style>
