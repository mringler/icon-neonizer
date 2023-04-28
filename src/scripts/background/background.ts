import { callContentApi } from '../../util/content-api-caller'
import { initBackgroundApi, reloadSettings } from './background-api'
import { Settings } from './storage/Settings'

initBackgroundApi()
reloadSettings()

browser.tabs.onUpdated.addListener(
    (tabId, changeInfo, tab) => callContentApi('verifyHref', [changeInfo.favIconUrl!], tab.id),
    { properties: ['favIconUrl'] }
)

setTimeout(() => Settings.load().then(settings => settings.runCleanup()), 60_000)
