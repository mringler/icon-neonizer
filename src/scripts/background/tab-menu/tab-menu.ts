import { loadActiveTab } from "@/util/active-tab";

export namespace TabMenu {
    export function createTabMenuItem() {
        browser.menus.create({
            id: "icon-neonizer__configure",
            type: "normal",
            title: "Configure Favicon",
            contexts: ["tab"],
            onclick() {
                loadActiveTab().then(tab => {
                    const createData = {
                        url: '/src/extension-page/extension-page.html',
                        openerTabId: tab?.id,
                    }
                    browser.tabs.create(createData)
                })
            }
        });
    }
}