import { Blacklist, BlacklistedPage } from '@/scripts/background/storage/blacklist'
import { IconStorage } from '@/scripts/background/storage/icon-storage'
import { SvgColorReplacer } from '@/scripts/background/tracer/svg-color-replacer'
import { svgToKilobyte } from '@/util/byte-to-kilobyte'
import { ref, Ref, isRef, unref, watchEffect, computed } from 'vue'

export function useTracedSvg(url: string | null | undefined | Ref<string | null | undefined>) {
    const svg: Ref<string | null> = ref(null)
    const blacklistEntry: Ref<BlacklistedPage | undefined> = ref()
    const svgPromise: Ref<Promise<string | null> | undefined> = ref()

    const loadSvg = async () => {
        const iconUrl = unref(url)
        return iconUrl ? await IconStorage.loadIcon(iconUrl) : null
    }

    const loadReplacementUrl = async () => {
        const iconUrl = unref(url)
        return iconUrl ? await Blacklist.getBlacklistEntry(iconUrl) : undefined
    }

    const loadValues = async () => {
        [svg.value, blacklistEntry.value] = [null, undefined];
        svgPromise.value = loadSvg();
        [svg.value, blacklistEntry.value] = await Promise.all([svgPromise.value, loadReplacementUrl()] as const)
    }

    if (isRef(url)) {
        watchEffect(loadValues)
    } else {
        loadValues()
    }

    return { svg, blacklistEntry, svgPromise, reload: loadValues }
}

export function useTracedSvgInfo(tracedSvg: string | null | undefined | Ref<string | null | undefined>) {
    const svg = computed(() => unref(tracedSvg))
    const dom = computed(() => {
        if (!svg.value) return null
        try {
            return SvgColorReplacer.parseSvg(svg.value)
        } catch (e) {
            return null
        }
    })
    const countElementsInSvg = <K extends keyof SVGElementTagNameMap>(tagName: K) => dom.value?.getElementsByTagName(tagName).length ?? null

    return {
        numberOfPaths: computed(() => countElementsInSvg('path')),
        numberOfGradients: computed(() => countElementsInSvg('linearGradient')),
        sizeKb: computed(() => svg.value ? svgToKilobyte(svg.value) : null),
    }
}