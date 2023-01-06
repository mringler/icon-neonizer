<script setup lang="ts">
import { onBeforeMount, ref, Ref, provide} from 'vue'
import AppBar from '@/components/AppBar.vue'
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import Loading from '@/components/Loading.vue';

const isLoading = ref(true)
const sourceTab: Ref<browser.tabs.Tab | null> = ref(null)
provide('sourceTab', sourceTab)
const showDrawer = ref(true)

async function getSourceTab(): Promise<browser.tabs.Tab | null> {
  const tab = await browser.tabs.getCurrent()
  const sourceTabId = tab.openerTabId
  if (sourceTabId === undefined) {
    return null
  }
  return browser.tabs.get(sourceTabId)
}

onBeforeMount(async () => {
  sourceTab.value = await getSourceTab()
  isLoading.value = false
})


const navigationItems = [
    { title: 'Page Icon', type: 'subheader', prependIcon: 'mdi-draw' },
    { title: 'Trace', value: 'trace', props: {to: '/', prependIcon: 'mdi-draw'} },
    { title: 'Edit', value: 'edit', props: {to: '/edit-current', prependIcon: 'mdi-pen'} },
    { title: 'Management', type: 'subheader' },
    { title: 'Storage', value: 'storage', props: {to: '/storage', prependIcon: 'mdi-database'} },
]

</script>

<template>
  <v-app>

    <AppBar @toggleNavigation="showDrawer = !showDrawer" />

    <NavigationDrawer
      :items="navigationItems"
      v-model="showDrawer"
    />

    <v-main>
      <v-container fluid tag="section">
        <Loading v-if="isLoading"/>

        <router-view v-else></router-view>
      </v-container>
    </v-main>

  </v-app>
</template>
<style scoped>

</style>
