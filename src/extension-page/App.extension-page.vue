<script setup lang="ts">
import { ref } from 'vue'
import AppBar from '@/components/util/AppBar.vue'
import NavigationDrawer from '@/components/util/NavigationDrawer.vue'
import Confirmation from '@/components/util/Confirmation.vue'
import { createConfirmationDialog } from '@/composables/confirmDialog'
import { createLoadingSpinner } from '@/composables/loadingSpinner'
import { mdiDraw, mdiPen, mdiDatabase, mdiCancel, mdiCog } from '@mdi/js'

const loadingItems = createLoadingSpinner()
const confirmProps = createConfirmationDialog()
const showDrawer = ref(true)

const navigationItems = [
    { title: 'Page Icon', type: 'subheader' },
    { title: 'Trace', value: 'trace', props: { to: '/', prependIcon: mdiDraw } },
    { title: 'Edit', value: 'edit', props: { to: '/edit-current', prependIcon: mdiPen } },
    { title: 'Management', type: 'subheader' },
    { title: 'Storage', value: 'storage', props: { to: '/storage', prependIcon: mdiDatabase } },
    { title: 'Blacklist', value: 'blacklist', props: { to: '/blacklist', prependIcon: mdiCancel } },
    { title: 'Settings', value: 'settings', props: { to: '/settings', prependIcon: mdiCog } },
]
</script>

<template>
    <v-app>
        <AppBar @toggleNavigation="showDrawer = !showDrawer" />

        <NavigationDrawer
            :items="navigationItems"
            v-model="showDrawer"
        />

        <v-main>
            <v-progress-linear
                indeterminate
                color="purple"
                v-if="loadingItems > 0"
            />

            <v-container
                fluid
                tag="section"
            >
                <router-view></router-view>
            </v-container>
        </v-main>

    <Confirmation
        :showConfirm="Boolean(confirmProps)"
        @update:showConfirm="confirmProps = null"
        v-bind="confirmProps"
    />
</v-app></template>
<style scoped></style>
