<script setup lang="ts">
function reloadBackground() {
    browser.runtime.reload()
}
</script>

<template>
    <v-app-bar
        color="deep-purple accent-4"
        dark
        app
        class="header-gradient"
    >
        <v-app-bar-nav-icon @click.stop="$emit('toggleNavigation')">
            <img
                alt="Icon Neonizer Logo"
                src="/icons/logo-48.png"
            />
        </v-app-bar-nav-icon>

        <v-toolbar-title>Icon Neonizer</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn
            icon
            @click="reloadBackground"
        >
            <v-icon>mdi-reload</v-icon>
        </v-btn>
    </v-app-bar>
</template>
<style scoped></style>
