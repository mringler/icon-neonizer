import { FaviconRequestFilterType } from "../request-filter/FaviconRequestFilterType"
import { IconStorage } from "./icon-storage"

export interface SettingsData {
    cleanupIntervalMs: number
    enableTabMenu: boolean
    faviconRequestFilter: FaviconRequestFilterType
    filterTouchIcon: boolean
    output: OutputSettings
}

export interface OutputSettings {
    format: 'svg' | 'png'
    pngWidth: number
}

export class Settings implements SettingsData{

    public static async load(reload = false){
        if(!Settings.instance || reload){
            const stored = await IconStorage.loadSettings()
            Settings.instance = new Settings(stored)
        }
        return Settings.instance
    }

    private static instance: Settings|undefined 

    cleanupIntervalMs: number
    enableTabMenu: boolean
    faviconRequestFilter: FaviconRequestFilterType
    filterTouchIcon: boolean
    output: OutputSettings

    private constructor(data?: SettingsData){
        this.enableTabMenu = data?.enableTabMenu ?? true
        this.cleanupIntervalMs = data?.cleanupIntervalMs ?? 12096e5
        this.faviconRequestFilter = data?.faviconRequestFilter ?? FaviconRequestFilterType.byName
        this.filterTouchIcon = data?.filterTouchIcon ?? false
        this.output = {
            format: data?.output?.format ?? 'svg',
            pngWidth: data?.output?.pngWidth ?? 64
        }
    }

    public store(){
        return IconStorage.storeSettings({
            cleanupIntervalMs: this.cleanupIntervalMs,
            enableTabMenu: this.enableTabMenu,
            faviconRequestFilter: this.faviconRequestFilter,
            filterTouchIcon: this.filterTouchIcon,
            output: {...this.output}
        })
    }

    public get cleanupIntervalDays(): number{
        return this.cleanupIntervalMs / (24 * 60 * 60 * 1000)
    }

    public set cleanupIntervalDays(days: number){
        this.cleanupIntervalMs = days * (24 * 60 * 60 * 1000)
    }

    public runCleanup(){
        return IconStorage.cleanup(this.cleanupIntervalMs)
    }

}
