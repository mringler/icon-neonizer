const EditCurrentSvgPage = () => import('./EditCurrentSvgPage.vue')
const SvgEditor = () => import('@/components/svg-editor/SvgEditor.vue')
const EditSvgPage = () => import('@/components/svg-editor/SvgEditorFromUrl.vue')
const StorageListPage = () => import('./StorageListPage.vue')
const TraceUrlPage = () => import('./TraceUrlPage.vue')
const TraceTabPage = () => import('./TraceTabPage.vue')
const BlacklistPage = () => import('./blacklist-page/BlacklistPage.vue')


import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { SettingsRoutes } from './settings-page/settings-routes'

const routes: RouteRecordRaw[] = [
    { name: 'trace-current', path: '/', component: TraceTabPage },
    { name: 'edit-current', path: '/edit-current', component: EditCurrentSvgPage },
    { name: 'view-storage', path: '/storage', component: StorageListPage },
    { name: 'trace-by-url', path: '/trace-url/:url', component: TraceUrlPage, props: true },
    { name: 'edit-svg', path: '/edit-svg/:url/:svg', component: SvgEditor, props: true },
    {
        name: 'edit-by-url',
        path: '/edit-svg/:url',
        component: EditSvgPage,
        props: (route) => {
            const isLocked = route.query.isLocked && route.query.isLocked !== '0'
            return { url: route.params.url, isLocked }
        },
    },
    { name: 'blacklist', path: '/blacklist', component: BlacklistPage},
    
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

SettingsRoutes.declareRoutes(router)
