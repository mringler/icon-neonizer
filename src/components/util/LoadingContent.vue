<script setup lang="ts">
import type { SetLoading } from '@/extension-page/App.extension-page.vue';
import { inject, watch } from 'vue'
import Loading from '@/components/util/Loading.vue'


type Props = {
    isLoading: boolean,
    showOnChrome?: boolean,
}
const props = defineProps<Props>()
const setLoading: SetLoading = inject('setLoading', v => undefined)

watch(
    () => props.isLoading,
    () => props.showOnChrome && setLoading(props.isLoading),
    { immediate: true }
)

</script>

<template>

    <slot
        v-if="props.isLoading"
        name="loader"
    >
        <Loading v-if="!props.showOnChrome"/>
    </slot>
    <slot v-else />

</template>
<style scoped>

</style>
