<script setup lang="ts">
import { ref, Ref, watch, onBeforeMount } from 'vue'
import Heading from '@/components/Heading.vue';
import { callBackgroundApi } from '@/util/background-api';
import AlertSnackbar from './AlertSnackbar.vue';

type Props = {
    url: string,
    isLocked?: boolean
}
const props = defineProps<Props>()

const originalSvg: Ref<string | null> = ref(null)
const editedSvg: Ref<string | null> = ref(null)
const isLocked = ref(false)
const snackbarMessage = ref<string | null>(null)

const loading = ref(true)

const loadSvg = async () => {
    loading.value = true
    editedSvg.value = originalSvg.value = await callBackgroundApi('getStoredIcon', [props.url])
    loading.value = false
}
watch(() => props.url, loadSvg, { immediate: true })
watch(() => props.isLocked, () => isLocked.value = Boolean(props.isLocked), { immediate: true })

const reset = () => editedSvg.value = originalSvg.value
const store = async () => {
    await callBackgroundApi('storeIcon', [props.url, editedSvg.value as string, isLocked.value])
    originalSvg.value = editedSvg.value
    snackbarMessage.value = 'Icon updated'
}
</script>

<template>

    <AlertSnackbar v-model:message="snackbarMessage" />

    <Loading v-if="loading" />
    <section
        v-else
        tag="section"
    >
        <Heading>Edit SVG</Heading>

        <p>Manually edit the replacement icon SVG.</p>
        <v-container>
            <v-row>
                <v-col
                    cols="12"
                    md="9"
                    xl="8"
                >

                    <v-textarea
                        variant="filled"
                        label="Svg Image"
                        auto-grow
                        v-model="editedSvg"
                    ></v-textarea>

                </v-col><v-col
                    cols="12"
                    md="3"
                    xl="4"
                >

                    <div style="position: sticky; top: 70px;">
                        <div
                            v-html="editedSvg"
                            class="icon-frame mb-2"
                        ></div>
                        <div
                            v-html="editedSvg"
                            style="width: 27px;"
                        ></div>

                        <v-btn
                            variant="plain"
                            color="secondary"
                            @click.stop="reset"
                        >
                            Reset
                        </v-btn>
                        <v-btn
                            variant="outlined"
                            color="primary"
                            :disabled="!props.url || !editedSvg"
                            @click.stop="store"
                        >
                            Save
                        </v-btn>

                        <v-checkbox
                            v-model="isLocked"
                            :value="true"
                            label="protect from automatic override"
                            hide-details
                        ></v-checkbox>
                    </div>
                </v-col>
            </v-row>

        </v-container>
    </section>

</template>
<style scoped>

</style>
