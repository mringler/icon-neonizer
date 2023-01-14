<script setup lang="ts">
import { onBeforeMount, ref, Ref, provide } from 'vue'
import AppBar from '@/components/AppBar.vue'
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import Confirmation, { ConfirmProps } from '@/components/Confirmation.vue';


export type WithLoading = <T>(promise: Promise<T>) => Promise<T>
export type SetLoading = (value: boolean) => void
const loadingItems = ref(0)

const setLoading = (value: boolean) => {
  loadingItems.value += value ? 1 : -1
}
provide('setLoading', setLoading)

const withLoading : WithLoading = async (promise) => {
  loadingItems.value++
  const res = await promise
  loadingItems.value--
  return res
}
provide('withLoading', withLoading)



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
})


const navigationItems = [
  { title: 'Page Icon', type: 'subheader', prependIcon: 'mdi-draw' },
  { title: 'Trace', value: 'trace', props: { to: '/', prependIcon: 'mdi-draw' } },
  { title: 'Edit', value: 'edit', props: { to: '/edit-current', prependIcon: 'mdi-pen' } },
  { title: 'Management', type: 'subheader' },
  { title: 'Storage', value: 'storage', props: { to: '/storage', prependIcon: 'mdi-database' } },
  { title: 'Blacklist', value: 'blacklist', props: { to: '/blacklist', prependIcon: 'mdi-cancel' } },
]

const confirmProps: Ref<ConfirmProps | null> = ref(null)
function showConfirm(props: ConfirmProps) {
  confirmProps.value = props
}
provide('showConfirm', showConfirm)

</script>

<template>
  <v-app>

    <AppBar @toggleNavigation="showDrawer = !showDrawer" />

    <NavigationDrawer
      :items="navigationItems"
      v-model="showDrawer"
    />

    <v-main>
      <v-progress-linear
        indeterminate
        color="purple"
        v-if="loadingItems > 0"
      />
      
      <v-container
        fluid
        tag="section"
      >
        <router-view></router-view>
      </v-container>
    </v-main>

    <Confirmation
      :showConfirm="Boolean(confirmProps)"
      @update:showConfirm="confirmProps = null"
      v-bind="confirmProps"
    />

  </v-app>
</template>
<style scoped>

</style>
