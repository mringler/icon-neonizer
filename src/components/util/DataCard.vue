<script setup lang="ts">
type Props = {
    data: { [label: string]: string | number }
}
const props = defineProps<Props>()
</script>

<template>
    <v-card>
        <v-card-text>
            <v-table>
                <tr
                    v-for="(value, label) in props.data"
                    :key="label"
                >
                    <td>{{ label }}:</td>
                    <td>{{ value }}</td>
                </tr>
            </v-table>
        </v-card-text>
    </v-card>
</template>
<style scoped></style>
