export namespace TabMenu {
    const id = "icon-neonizer__configure"
    let state: boolean = false

    export async function setTabMenuItem(enable: boolean) {
        if (state === enable) {
            return
        }
        enable ? addTabMenuItem() : removeTabMenuItem()
        state = enable
    }

    function addTabMenuItem() {
        browser.menus.create({
            id,
            type: "normal",
            title: "Configure Favicon",
            contexts: ["tab"],
            documentUrlPatterns: ['*://*/*'],
            onclick(info, tab) {
                const createData: browser.tabs._CreateCreateProperties = {
                    url: '/src/extension-page/extension-page.html',
                    openerTabId: tab?.id,
                }
                browser.tabs.create(createData)
            }
        });
    }

    function removeTabMenuItem() {
        browser.menus.remove(id)
    }
}
