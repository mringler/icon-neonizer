<script setup lang="ts">
import { mdiHelpCircleOutline } from '@mdi/js'
</script>

<template>
    <v-tooltip
        openOnHover
        origin="center center"
        location="top"
        persistent
        maxWidth="400"
        v-bind="$attrs"
    >
        <template v-slot:activator="{ props }">
            <v-icon
                v-bind="props"
                color="primary"
                :icon="mdiHelpCircleOutline"
            />
        </template>
        <slot />
    </v-tooltip>
</template>
<style scoped></style>
