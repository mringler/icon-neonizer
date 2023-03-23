<script setup lang="ts">
type Item = any // TODO get from Vuetify
type Props = { items: Item[] }
const props = defineProps<Props>()
</script>

<template>
    <v-navigation-drawer
        :value="true"
        v-bind="$attrs"
        app
    >
        <v-list :items="props.items"></v-list>
    </v-navigation-drawer>
</template>
<style scoped></style>
