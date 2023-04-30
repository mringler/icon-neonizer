<script setup lang="ts">
import { mdiImageRemove } from '@mdi/js'
type Props = {
    width?: string
    height?: string
    isEmpty?: boolean
    isLoading?: boolean
    noFrame?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    width: '200px',
    height: '200px',
})
</script>

<template>
    <div
        class="d-flex justify-center align-center"
        :class="{
            'icon-frame': !props.noFrame,
        }"
        :style="{
            width: props.width,
            height: props.height,
        }"
    >
        <div v-if="props.isLoading">
            <v-progress-circular
                indeterminate
                color="primary"
            ></v-progress-circular>
        </div>
        <slot
            name="no-content"
            v-else-if="props.isEmpty"
        >
            <v-icon :icon="mdiImageRemove" />
        </slot>

        <slot v-else></slot>
    </div>
</template>

<style scoped>
.icon-frame {
    border: 2px solid rgb(143, 143, 143);
}
</style>
