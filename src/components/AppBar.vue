<script setup lang="ts">

</script>

<template>
    <v-app-bar
        color="deep-purple accent-4"
        dark
        app
        class="header-gradient"
    >
        <v-app-bar-nav-icon @click.stop="$emit('toggleNavigation')"></v-app-bar-nav-icon>
        <v-app-bar-nav-icon>
            <img
                alt="Icon Neonizer Logo"
                src="/icons/icon-neonizer.png"
            />
        </v-app-bar-nav-icon>

        <v-toolbar-title>Icon Neonizer</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
            <v-icon>mdi-filter</v-icon>
        </v-btn>

        <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
    </v-app-bar>

</template>
<style scoped>

</style>
