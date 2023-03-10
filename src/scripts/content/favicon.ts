export namespace Favicon {

    export function getPageFaviconHref(): string | null {
        const element = getLargestFaviconHtmlElement()
        if(!element){
            return null
        }
        if(element.dataset.oldHref){
            return element.dataset.oldHref
        }
        return element.href?.trim();
    }

    export function getGoogleApiUrl(domain: string|undefined): string {
        domain ??= window.location.hostname
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`
    }

    function getFaviconHtmlElement(): HTMLLinkElement | null {
        return document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    }

    function getFaviconHtmlElements(): NodeListOf<HTMLLinkElement> {
        return document.querySelectorAll<HTMLLinkElement>("link[rel~='icon']"); // "link[rel$='icon'], link[rel~='image_src']"
    }

    export function urlIsFavicon(url: string): boolean {
        const urlEnd = url.replace(/https?:\/\/[^\/]+\//, '/')
        return Boolean(document.querySelector<HTMLLinkElement>(`link[rel~='icon'][href$="${urlEnd}"]`));
    }

    export function fixupForFilteredUrl(url: string){
        const urlEnd = url.replace(/https?:\/\/[^\/]+\//, '/')
        const nodes = document.querySelectorAll<HTMLLinkElement>(`link[rel~='icon'][href$="${urlEnd}"]`)
        nodes.forEach(node => {
            node.type = 'image/svg+xml'
            node.dataset.neFilter = "1"
        })
    }

    export function urlIsHandledByFilter(url: string): boolean{
        const urlEnd = url.replace(/https?:\/\/[^\/]+\//, '/')
        return document.querySelector<HTMLLinkElement>(`link[rel~='icon'][href$="${urlEnd}"]`)?.dataset.neFilter === "1";
    }

    function getLargestFaviconHtmlElement(): HTMLLinkElement | null {
        const nodes = getFaviconHtmlElements();
        if (nodes.length === 0) {
            return null
        }
        if (nodes.length === 1) {
            return nodes[0]
        }
        let foundSize = 0, foundIx = 0;
        for (let elementIx = 0; elementIx < nodes.length; elementIx++) {
            const node = nodes[elementIx]
            const sizes = node.sizes
            if (sizes.length === 0 || node.type === 'image/svg+xml') {
                continue
            }
            for (let sizeIx = 0; sizeIx < sizes.length; sizeIx++) {
                const size = parseInt(sizes[sizeIx].toLowerCase().split('x')[0])
                if (size <= foundSize) {
                    continue;
                }

                foundSize = size;
                foundIx = elementIx;
                break;
            }
        }
        return nodes[foundIx];
    }

    export function setBase64Icon(base64Icon: string): void {
        const linkElement = getFaviconHtmlElement();
        if (!linkElement) {
            return
        }
        linkElement.href = base64Icon
    }

    export function setSvg(svgString: string): void {
        updateLinkElements(svgString)
    }

    export function svgToHref(svgString: string): string{
        return 'data:image/svg+xml,' + encodeURIComponent(svgString);
    }

    function updateLinkElements(svgString: string) {
        if (!document.head || !svgString) {
            return;
        }

        const href = svgToHref(svgString)
        const elements = getFaviconHtmlElements();
        if (elements.length === 0) {
            const linkElement = document.createElement('link');
            linkElement.rel = 'icon';
            fixupLinkElement(linkElement, href);
            document.head.appendChild(linkElement);
            return;
        }
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i]
            fixupLinkElement(element, href);
            document.head.appendChild(element)
        }
    }

    function fixupLinkElement(linkElement: HTMLLinkElement, href: string): void {
        if (!linkElement.dataset.oldHref && linkElement.href) {
            linkElement.dataset.oldHref = linkElement.href;
        }
        linkElement.type = 'image/svg+xml';
        linkElement.href = href;
        if (linkElement.sizes) {
            linkElement.sizes.add('any');
        }
    }

}
