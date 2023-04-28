import type { RouteLocationNormalized, Router } from 'vue-router'

const SettingsPage = () => import('./SettingsPage.vue')
const SettingsEntries = () => import('./SettingsEntries.vue')
const CleanupIntervalInput = () => import('./inputs/CleanupIntervalInput.vue')
const UseTabMenuSwitch = () => import('./inputs/UseTabMenuSwitch.vue')
const ResetTraceOptions = () => import('./inputs/ResetTraceOptions.vue')
const RequestFilterOptions = () => import('./inputs/RequestFilterOptions.vue')

export namespace SettingsRoutes {
    export function declareRoutes(router: Router) {
        router.addRoute({
            path: '/settings',
            component: SettingsPage,
            children: [
                { path: '', name: 'settings', component: SettingsEntries, },
                { path: 'cleanup', name: 'cleanup', component: CleanupIntervalInput, },
                { path: 'tab-menu', name: 'tab-menu', component: UseTabMenuSwitch, },
                { path: 'trace-options', name: 'reset-trace-options', component: ResetTraceOptions, },
                { path: 'request-filter-settings', name: 'request-filter-settings', component: RequestFilterOptions, },
            ]
        })
    }
}