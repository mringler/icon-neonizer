import EditCurrentSvgPage from './EditCurrentSvgPage.vue'
import SvgEditor from '@/components/svg-editor/SvgEditor.vue'
import EditSvgPage from '@/components/svg-editor/SvgEditorFromUrl.vue'
import StorageListPage from './StorageListPage.vue'
import TraceUrlPage from './TraceUrlPage.vue'
import TraceTabPage from './TraceTabPage.vue'
import BlacklistPage from './blacklist-page/BlacklistPage.vue'

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

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
    { name: 'blacklist', path: '/blacklist', component: BlacklistPage },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
