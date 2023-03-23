import { ScriptsApi, buildApi } from '../ApiInterfaces'
import { InlineImageLoader } from './inline-image-loader'
import { Blacklist } from './storage/blacklist'
import { IconStorage } from './storage/icon-storage'
import { SvgColorReplacer } from './tracer/svg-color-replacer'
import type { GradientDrawerOptions } from './tracer/svg-drawer/gradient-drawer-options'
import { Tracer } from './tracer/tracer'

export type BackgroundApiInterface = ScriptsApi<typeof backgroundApi>

export async function initBackgroundApi() {
    buildApi(backgroundApi)
}

const backgroundApi = {
    processIconUrl,
    processInlineData,
    getStoredIcon: IconStorage.loadIcon,
    storeIcon: IconStorage.storeIcon,
    getStoredIcons: IconStorage.loadAll,
    removeIcon: IconStorage.removeIcon,
    getOptions: Tracer.getOptions,
    traceWithOptions,
}

async function processIconUrl(
    iconUrl: string,
    force = false,
    store = true
): Promise<string | null> {
    return processIconData(iconUrl, () => traceByUrl(iconUrl), force, store)
}

async function processInlineData(inlineData: string, url: string, force = false, store = true) {
    return processIconData(url, () => traceInlineData(inlineData), force, store)
}

async function traceWithOptions(iconUrl: string, customOptions?: Partial<GradientDrawerOptions>) {
    return iconUrl.startsWith('data:image')
        ? traceInlineData(iconUrl, customOptions)
        : traceByUrl(iconUrl, customOptions)
}

async function traceInlineData(inlineData: string, customOptions?: Partial<GradientDrawerOptions>) {
    const [contentType, data] = InlineImageLoader.parseIcon(inlineData)
    if (!data) {
        throw new Error('No data from inlineData' + inlineData)
    }
    return contentType === 'data:image/svg+xml'
        ? SvgColorReplacer.replaceColorsInSvg(data, customOptions)
        : Tracer.traceBuffer(new TextEncoder().encode(data), customOptions)
}

async function traceByUrl(iconUrl: string, customOptions?: Partial<GradientDrawerOptions>) {
    const response = await fetch(iconUrl)
    if (!response.ok) {
        throw new Error('Failed to load image from url ' + iconUrl)
    }

    const arrayBuffer = await response.arrayBuffer()

    const contentType = response.headers.get('content-type')
    if (contentType !== 'image/svg+xml') {
        return Tracer.traceBuffer(arrayBuffer, customOptions)
    }

    const svgString = new TextDecoder().decode(arrayBuffer)
    return SvgColorReplacer.replaceColorsInSvg(svgString, customOptions)
}

async function processIconData(
    iconUrl: string,
    loader: () => Promise<string> | string,
    force = false,
    store = true
): Promise<string | null> {
    const blacklistEntry = await Blacklist.getBlacklistEntry(iconUrl)
    if (blacklistEntry?.replacementUrl) {
        iconUrl = blacklistEntry.replacementUrl
    }
    let icon = await IconStorage.loadIcon(iconUrl)
    if (icon && !force) {
        return icon
    }

    if (blacklistEntry) {
        return null
    }

    try {
        icon = await loader()
    } catch (e) {
        console.log(`Error tracing ${iconUrl}`, e)
        return null
    }
    store && IconStorage.storeIcon(iconUrl, icon)
    return icon
}
