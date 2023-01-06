import LZString from 'lz-string'

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

    export async function loadAll(): Promise<ImageDataRecord[]> {
        const entries = await browser.storage.local.get(null as unknown as string) as Record<string, ImageEntry>
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
}