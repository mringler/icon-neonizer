import LZString from 'lz-string'
import type { BlacklistedPage } from './blacklist'
import type { GradientDrawerOptions } from '../tracer/svg-drawer/gradient-drawer-options'
import type { SettingsData } from './Settings'

const NonIconKey = {
    options: '--options--',
    blacklistedPages: '--blacklist--',
    settings: '--settings--'
} as const

type NonIconKeyLiteral = (typeof NonIconKey)[keyof typeof NonIconKey]

type ImageEntry = {
    i: string // icon
    a: number // lastAccess
    k?: 0 | 1 // keep / no automatic override
    s?: 0 | 1 // url has https, defaults to 1
    w?: 0 | 1 // url has www prefix
}

export type ImageDataRecord = {
    icon: string
    lastAccess: number
    url: string
    size: number
    noAutomaticOverride: boolean
}

const urlPrefixRegex = /^(https?:\/\/)?(www\.)?/

export namespace IconStorage {
    function cleanUrl(url: string) {
        return url.replace(urlPrefixRegex, '')
    }

    function restoreUrl(url: string, entry: ImageEntry): string {
        const protocol = entry.s === 0 ? 'http' : 'https'
        const www = entry.w ? 'www.' : ''
        return `${protocol}://${www}${url}`
    }

    function buildImageEntry(rawUrl: string, icon: string, noAutomaticOverride: boolean | 0 | 1) {
        const data: ImageEntry = {
            i: LZString.compressToUTF16(icon),
            a: Date.now(),
        }
        if (noAutomaticOverride) {
            data.k = 1
        }
        if (!rawUrl.startsWith('https://')) {
            data.s = 0
        }
        const hasWWW = /^https?:\/\/www\./.test(rawUrl)
        if (hasWWW) {
            data.w = 1
        }
        return data
    }

    export async function storeIcon(
        url: string,
        icon: string,
        noAutomaticOverride?: boolean | 0 | 1
    ): Promise<void> {
        if (!url) {
            return
        }
        const cleanedUrl = cleanUrl(url)
        if (noAutomaticOverride === undefined) {
            const oldEntry = await loadImageData(cleanedUrl)
            noAutomaticOverride = oldEntry?.k ?? false
        }
        const data = buildImageEntry(url, icon, noAutomaticOverride)
        await browser.storage.local.set({ [cleanedUrl]: data })
    }

    export async function hasIconForUrl(url: string): Promise<boolean> {
        const cleanedUrl = cleanUrl(url)
        const entry = (await browser.storage.local.get(cleanedUrl)) as Record<
            string,
            ImageEntry | null
        >
        return Boolean(entry)
    }

    async function loadImageData(url: string): Promise<ImageEntry | undefined> {
        const data = (await browser.storage.local.get(url)) as Record<string, ImageEntry>
        return data[url]
    }

    export async function loadIcon(url: string): Promise<string | null> {
        const cleanedUrl = cleanUrl(url)
        const imageEntry = await loadImageData(cleanedUrl)
        if (!imageEntry) {
            return null //Promise.reject()
        }
        const icon = LZString.decompressFromUTF16(imageEntry.i) as string
        storeIcon(url, icon, imageEntry.k) // update access data
        return icon
    }

    async function loadAllImageData(): Promise<Record<string, ImageEntry>> {
        const storeData = await browser.storage.local.get()
        Object.values(NonIconKey).forEach((key) => delete storeData[key])
        return storeData as Record<string, ImageEntry>
    }

    export async function loadAll(): Promise<ImageDataRecord[]> {
        const entries = await loadAllImageData()
        const encoder = new TextEncoder()
        return Object.entries(entries).map(([url, data]) => {
            return {
                url: restoreUrl(url, data),
                icon: LZString.decompressFromUTF16(data.i) as string,
                lastAccess: data.a,
                noAutomaticOverride: Boolean(data.k),
                size: encoder.encode(data.i).length,
            }
        })
    }

    export async function removeIcon(url: string): Promise<void> {
        url = cleanUrl(url)
        return browser.storage.local.remove(url)
    }

    export async function cleanup(interval: number) {
        console.log('RUNNING CLEANUP')
        if (interval <= 0) {
            return
        }
        const thresholdTimestamp = Date.now() - interval;
        const entries = await loadAllImageData()
        Object.entries(entries).forEach(([url, data]) => {
            (!data.k && data.a < thresholdTimestamp) && removeIcon(url)
        })
    }

    async function storeNonIcon<ValueType = any>(key: NonIconKeyLiteral, value: ValueType) {
        return browser.storage.local.set({ [key]: value })
    }

    async function loadNonIcon<ValueType = any>(
        key: NonIconKeyLiteral,
        defaultValue?: ValueType
    ): Promise<typeof defaultValue> {
        const entry = await browser.storage.local.get(key)
        return (entry[key] as ValueType) ?? defaultValue
    }

    export async function storeOptions(options: GradientDrawerOptions) {
        const { verbose, ...storeOptions } = options
        if (storeOptions.palette?.length === 0) {
            storeOptions.palette = null
        }
        return storeNonIcon<GradientDrawerOptions>(NonIconKey.options, storeOptions)
    }

    export async function loadOptions(): Promise<GradientDrawerOptions | undefined> {
        return loadNonIcon<GradientDrawerOptions>(NonIconKey.options)
    }

    export async function removeOptions(): Promise<void> {
        return browser.storage.local.remove(NonIconKey.options)
    }

    /* Settings */
    export async function storeSettings(settings: SettingsData) {
        return storeNonIcon<SettingsData>(NonIconKey.settings, settings)
    }

    export async function loadSettings(): Promise<SettingsData | undefined> {
        return loadNonIcon<SettingsData>(NonIconKey.settings, undefined)
    }

    /* Blacklist */
    export async function storeBlacklist(blacklist: BlacklistedPage[]) {
        blacklist.sort()
        return storeNonIcon(NonIconKey.blacklistedPages, blacklist)
    }

    export async function loadBlacklist(): Promise<BlacklistedPage[]> {
        return loadNonIcon<BlacklistedPage[]>(NonIconKey.blacklistedPages, []) as Promise<
            BlacklistedPage[]
        >
    }

    /*
    (async function(){
        const all = await loadAllImageData()
        console.log(all)
        Object.entries(all).map(([url, data]) => {
            if(![
                'typescriptlang.org/favicon-32x32.png?v=8944a05a8b601855de116c8a56d3b3ae',
                'google.com/images/branding/product/ico/maps15_bnuw3a_32dp.ico'
            ].includes(url)){
                return
            }
            data.w = 1
            console.log('updating', url, data)
            //browser.storage.local.set({ [url]: data });
        })
    })()
    */
}
