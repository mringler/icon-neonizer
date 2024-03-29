export namespace Favicon {
    export function getPageFaviconHref(dom?: Document): string | undefined {
        const element = getLargestFaviconHtmlElement(dom)
        if (!element) {
            return undefined
        }
        if (element.dataset.oldHref) {
            return element.dataset.oldHref
        }
        return element.href?.trim()
    }

    export function getGoogleApiUrl(domain: string | undefined): string {
        domain ??= window.location.hostname
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`
    }

    function getFaviconHtmlElement(): HTMLLinkElement | null {
        return document.querySelector<HTMLLinkElement>('link[rel~="icon"]')
    }

    function getFaviconHtmlElements(dom = document): NodeListOf<HTMLLinkElement> {
        return dom.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]') // "link[rel$='icon'], link[rel~='image_src']"
    }
    export function fixupForFilteredUrl(url: string) {
        const urlEnd = url.replace(/https?:\/\/[^\/]+\//, '/')
        const nodes = document.querySelectorAll<HTMLLinkElement>(
            `link[rel~='icon'][href$="${urlEnd}"]`
        )
        nodes.forEach((node) => {
            node.type = 'image/svg+xml'
            node.dataset.neFilter = '1'
        })
        return nodes.length > 0
    }

    export function urlIsHandledByFilter(): boolean {
        const links = document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]')
        if (links.length === 0) {
            return true
        }
        for (let i = 0; i < links.length; i++) {
            if (links[i].dataset.neFilter) {
                return true
            }
        }
        return false
    }

    export function urlIsReplaced(): boolean {
        return Boolean(document.querySelector<HTMLLinkElement>('link[rel~="icon"][data-old-href]'))
    }

    function getLargestFaviconHtmlElement(dom?: Document): HTMLLinkElement | null {
        const nodes = getFaviconHtmlElements(dom)
        if (nodes.length === 0) {
            return null
        }
        if (nodes.length === 1) {
            return nodes[0]
        }
        let foundSize = 0,
            foundIx = 0
        for (let elementIx = 0; elementIx < nodes.length; elementIx++) {
            const node = nodes[elementIx]
            const sizes = node.sizes
            if (sizes.length === 0 || node.type === 'image/svg+xml') {
                foundIx = elementIx
                break;
            }
            for (let sizeIx = 0; sizeIx < sizes.length; sizeIx++) {
                const size = parseInt(sizes[sizeIx].toLowerCase().split('x')[0])
                if (size <= foundSize) {
                    continue
                }

                foundSize = size
                foundIx = elementIx
                break
            }
        }
        return nodes[foundIx]
    }

    export function setBase64Icon(base64Icon: string): void {
        const linkElement = getFaviconHtmlElement()
        if (!linkElement) {
            return
        }
        linkElement.href = base64Icon
    }

    export function setImage(imgString: string, isSvg: boolean): void {
        updateLinkElements(imgString, isSvg)
    }

    export function svgToHref(svgString: string): string {
        return 'data:image/svg+xml,' + encodeURIComponent(svgString)
    }

    function updateLinkElements(imgString: string, isSvg = true) {
        if (!document.head || !imgString) {
            return
        }

        const href = isSvg ? svgToHref(imgString) : imgString
        const elements = getFaviconHtmlElements()
        if (elements.length === 0) {
            const linkElement = document.createElement('link')
            linkElement.rel = 'icon'
            fixupLinkElement(linkElement, href, isSvg)
            document.head.appendChild(linkElement)
            linkElement.dataset.oldHref = 'none'
            return
        }
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i]
            fixupLinkElement(element, href, isSvg)
            document.head.appendChild(element)
        }
    }

    function fixupLinkElement(linkElement: HTMLLinkElement, href: string, isSvg: boolean): void {
        if (!linkElement.dataset.oldHref && linkElement.href) {
            linkElement.dataset.oldHref = linkElement.href
        }
        if (isSvg) {
            linkElement.type = 'image/svg+xml'
        }
        linkElement.href = href
        if (linkElement.sizes) {
            linkElement.sizes.add('any')
        }
    }
}
