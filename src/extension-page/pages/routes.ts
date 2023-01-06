

import EditCurrentSvgPage from './EditCurrentSvgPage.vue'
import EditSvgPage from '@/components/SvgEditor.vue'
import StorageListPage from './StorageListPage.vue'
import TracePage from './TracePage.vue'

import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
    { name: 'trace-current', path: '/', component: TracePage },
    { name: 'edit-current', path: '/edit-current', component: EditCurrentSvgPage },
    { name: 'view-storage', path: '/storage', component: StorageListPage },
    { name: 'edit-by-url', path: '/edit-svg/:url', component: EditSvgPage,  props: (route) => ({url: route.params.url, isLocked: route.params.isLocked}) },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
  })