import { IconStorage } from './icon-storage'

export type BlacklistedPage = {url: string, replacementUrl: string, comment: string}


export namespace Blacklist {

    export const loadBlacklist = IconStorage.loadBlacklist
    export const storeBlacklist = IconStorage.storeBlacklist

    export async function addPageToBlacklist(page: BlacklistedPage) {
        const blacklist = await loadBlacklist()
        if (!page.url || blacklist.some(blacklistedPage => blacklistedPage.url === page.url)) {
            return
        }
        blacklist.push(page)
        blacklist.sort( (p1, p2) => p1.url.localeCompare(p2.url))

        return Promise.all([
            storeBlacklist(blacklist),
            IconStorage.removeIcon(page.url),
        ])
    }

    export async function removePageFromBlacklist(blacklistedPage: BlacklistedPage) {
        const blacklist = await loadBlacklist()
        const ix = blacklist.findIndex(page => page.url === blacklistedPage.url)
        if (ix === -1) {
            return
        }
        blacklist.splice(ix, 1)
        return storeBlacklist(blacklist)
    }

    export async function isBlacklisted(url: string): Promise<boolean> {
        const entry = await getBlacklistEntry(url)
        return Boolean(entry)
    }

    export async function getBlacklistEntry(url: string): Promise<BlacklistedPage|undefined> {
        const ulrBlacklist = await IconStorage.loadBlacklist()
        return ulrBlacklist.find(blacklistedPage => url.startsWith(blacklistedPage.url) && url !== blacklistedPage.url)
    }
}
