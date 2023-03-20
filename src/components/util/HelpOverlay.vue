<script setup lang="ts">
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
                icon="mdi-help-circle-outline"
            />
            <!--v-btn icon="mdi-help" v-bind="props" size="small"/-->
        </template>
        <slot />

</v-tooltip></template>
<style scoped></style>
