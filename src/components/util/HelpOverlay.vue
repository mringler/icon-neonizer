<script setup lang="ts">

</script>

<template>
    <v-tooltip openOnHover origin="center center" location="top" persistent maxWidth="400px">
        <template v-slot:activator="{ props }">

            <v-icon
                v-bind="props"
                color="primary"
            >mdi-help</v-icon>
            <!--v-btn icon="mdi-help" v-bind="props" size="small"/-->
        </template>
        <slot />

    </v-tooltip>
</template>
<style scoped></style>
