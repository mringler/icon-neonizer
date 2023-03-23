<script setup lang="ts">
import { watchEffect } from 'vue'
import Loading from '@/components/util/Loading.vue'
import { useLoadingSpinner } from '@/composables/loadingSpinner'

type Props = {
    isLoading: boolean
    showOnChrome?: boolean
}
const props = defineProps<Props>()

const { setLoading } = useLoadingSpinner()
watchEffect(() => props.showOnChrome && setLoading(props.isLoading))
</script>

<template>
    <slot v-if="props.isLoading" name="loader">
        <Loading v-if="!props.showOnChrome" />
    </slot>
    <slot v-else />
</template>
<style scoped></style>
