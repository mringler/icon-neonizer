import type { Options } from '@image-tracer/core'
import LZString from 'lz-string'
import type { BlacklistedPage } from './blacklist'
import type { GradientDrawerOptions } from './svg-drawer/gradient-drawer-options'

const NonIconKey = {
    options: '--options--',
    blacklistedPages: '--blacklist--'
} as const

type NonIconKeyLiteral = typeof NonIconKey[keyof typeof NonIconKey]


type ImageEntry = {
    i: string // icon
    a: number // lastAccess
    k?: 0 | 1 // keep / no automatic override 
}

export type ImageDataRecord = {
    icon: string
    lastAccess: number
    url: string
    size: number
    noAutomaticOverride: boolean
}

export namespace IconStorage {


    export async function storeIcon(url: string, icon: string, noAutomaticOverride: boolean | 0 | 1 = false): Promise<void> {
        if (!url) {
            return
        }
        const data: ImageEntry = {
            i: LZString.compressToUTF16(icon),
            a: Date.now()
        }
        if (noAutomaticOverride) {
            data.k = 1
        }
        await browser.storage.local.set({ [url]: data });
    }

    export async function loadIcon(url: string): Promise<string | null> {
        const entry = await browser.storage.local.get(url) as Record<string, ImageEntry | null>
        const imageEntry = entry[url]
        if (!imageEntry) {
            return null//Promise.reject()
        }
        const icon = LZString.decompressFromUTF16(imageEntry.i) as string;
        storeIcon(url, icon, imageEntry.k) // update access data
        return icon
    }

    async function loadAllImageData(): Promise<Record<string, ImageEntry>> {
        const storeData = await browser.storage.local.get()
        Object.values(NonIconKey).forEach((key) => delete (storeData[key]))
        return storeData as Promise<Record<string, ImageEntry>>
    }

    export async function loadAll(): Promise<ImageDataRecord[]> {
        const entries = await loadAllImageData()
        const encoder = new TextEncoder();
        return Object.entries(entries).map(([url, data]) => {
            return {
                url,
                icon: LZString.decompressFromUTF16(data.i) as string,
                lastAccess: data.a,
                noAutomaticOverride: Boolean(data.k),
                size: encoder.encode(data.i).length
            }
        })
    }

    export async function removeIcon(url: string): Promise<void> {
        return browser.storage.local.remove(url)
    }

    export async function cleanup() {
        const twoWeeksAgo = Date.now() - 12096e5;
        const entries = await loadAllImageData()
        Object.entries(entries).forEach(([url, data]) => {
            (!data.k && data.a < twoWeeksAgo) && removeIcon(url)
        })
    }

    async function storeNonIcon<ValueType = any>(key: NonIconKeyLiteral, value: ValueType) {
        return browser.storage.local.set({ [key]: value });
    }

    async function loadNonIcon<ValueType = any>(key: NonIconKeyLiteral, defaultValue?: ValueType): Promise<typeof defaultValue> {
        const entry = await browser.storage.local.get(key);
        return entry[key] as ValueType ?? defaultValue
    }

    export async function storeOptions(options: GradientDrawerOptions) {
        return storeNonIcon<GradientDrawerOptions>(NonIconKey.options, options)
    }

    export async function loadOptions(): Promise<GradientDrawerOptions | undefined> {
        return loadNonIcon<GradientDrawerOptions>(NonIconKey.options)
    }

    // Blacklist 

    export async function storeBlacklist(blacklist: BlacklistedPage[]) {
        blacklist.sort()
        return storeNonIcon(NonIconKey.blacklistedPages, blacklist)
    }

    export async function loadBlacklist(): Promise<BlacklistedPage[]> {
        return loadNonIcon<BlacklistedPage[]>(NonIconKey.blacklistedPages, []) as Promise<BlacklistedPage[]>
    }
}
