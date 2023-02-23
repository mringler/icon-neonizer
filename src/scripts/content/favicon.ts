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

    export function getGoogleApiUrl(): string {
        const domain = window.location.hostname
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`
    }

    function getFaviconHtmlElement(): HTMLLinkElement | null {
        return document.querySelector("link[rel~='icon']");
    }

    function getFaviconHtmlElements(): NodeListOf<HTMLLinkElement> {
        return document.querySelectorAll("link[rel~='icon']"); // "link[rel$='icon'], link[rel~='image_src']"
    }

    function getLargestFaviconHtmlElement(): HTMLLinkElement | null {
        const elements = getFaviconHtmlElements();
        if (elements.length === 0) {
            return null
        }
        if (elements.length === 1) {
            return elements[0]
        }
        let foundSize = 0, foundIx = 0;
        for (let elementIx = 0; elementIx < elements.length; elementIx++) {
            const element = elements[elementIx]
            const sizes = element.sizes
            if (sizes.length === 0) {
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
        return elements[foundIx];
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
