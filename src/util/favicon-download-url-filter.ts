export function faviconDownloadUrl(faviconUrl: string): string{
    if(!faviconUrl || !faviconUrl.endsWith('/favicon.ico')){
        return faviconUrl;
    }
    if(!faviconUrl.startsWith('http')){
        faviconUrl = 'http://' + faviconUrl
    }
    const url = new URL(faviconUrl)
    url.searchParams.append('passFilter', '1')
    return url.toString()
    //return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=256`
}