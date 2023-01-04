import LZString from 'lz-string'

type ImageEntry = {
    icon: string
    lastAccess: number
}

export namespace IconStorage{


    export async function storeIcon(url: string, icon: string): Promise<void>
    {
        if(!url){
            return
        }
        await browser.storage.local.set({
            [url]: {
                icon: LZString.compressToUTF16(icon),
                lastAccess: Date.now()
            } as ImageEntry
        });
    }

    export async function loadIcon(url: string): Promise<string|null>
    {
        const entry = await browser.storage.local.get(url) as Record<string, ImageEntry|null>
        const imageEntry = entry[url]
        if (!imageEntry ){
            return null//Promise.reject()
        }
        const icon = LZString.decompressFromUTF16(imageEntry.icon) as string;
        storeIcon(url, icon) // update access data
        return icon
    }
}