<script setup lang="ts">
import { toRef } from 'vue'
import FaviconSvg from './FaviconSvg.vue'
import { useTracedSvg } from '@/composables/tracedSvg'

const props = defineProps<{
    url: string
    changeAfterLoad?: boolean
    showIconOnMissing?: boolean
}>()

const { svgPromise, blacklistEntry } = useTracedSvg(toRef(props, 'url'))
</script>

<template>
    <FaviconSvg :svg="svgPromise">
        <template
            v-if="!props.showIconOnMissing"
            v-slot:no-content
        >
            <div class="pa-4 text-center">
                No stored icon for
                <v-tooltip
                    :text="url"
                    location="bottom"
                >
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-bind="props"
                            variant="text"
                            color="secondary"
                        >url</v-btn>
                    </template>

                    <div v-if="Boolean(blacklistEntry)">(Blacklisted)</div>
                </v-tooltip>
            </div>
        </template>
    </FaviconSvg>
</template>

<style scoped></style>
