export namespace Favicon {

    export function getPageFaviconUrl(): string | null {
        const url = getLargestFaviconHtmlElement()?.href?.trim();
        return (url && url.substring(0, 10) !== 'data:image') ? url : null;
    }

    export function getCurrentFaviconData(): string | null {
        return getLargestFaviconHtmlElement()?.href?.trim() ?? null
    }

    export function getCurrentFavicon(): string | null {
        const data = getCurrentFaviconData()
        return (data && isInlineSvg(data)) ? decodeInlineSvg(data) : data;
    }

    function isInlineSvg(data: string): boolean{
        return data.substring(0, 19) === 'data:image/svg+xml,'
    }

    function decodeInlineSvg(data: string): string{
        const svgData = data.substring(19)
        return decodeURIComponent(svgData);
    }

    export function getGoogleApiUrl(): string {
        const domain = window.location.hostname
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`
    }
    
    function getFaviconHtmlElement(): HTMLLinkElement | null {
        return document.querySelector("link[rel~='icon']");
    }

    function getFaviconHtmlElements(): NodeListOf<HTMLLinkElement> {
        return document.querySelectorAll("link[rel~='icon']");
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
        window.onload = () => updateLinkElements(svgString)
    }

    function updateLinkElements(svgString: string){
        if (!document.head || !svgString) {
            return;
        }

        const elements = getFaviconHtmlElements();
        if (elements.length === 0) {
            const linkElement = document.createElement('link');
            fixupLinkElement(linkElement, svgString);
            document.head.appendChild(linkElement);
            return;
        }
        for (let i = 0; i < elements.length; i++) {
            fixupLinkElement(elements[i], svgString);
        }

    }

    function fixupLinkElement(linkElement: HTMLLinkElement, svgString: string): void {
        if (!linkElement.dataset.oldHref && linkElement.href) {
            linkElement.dataset.oldHref = linkElement.href;
        }
        linkElement.type = 'image/svg+xml';
        linkElement.href = 'data:image/svg+xml,' + encodeURIComponent(svgString);
        if (linkElement.sizes) {
            linkElement.sizes.add('any');
        }

    }
}