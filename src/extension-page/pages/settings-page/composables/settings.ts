import { Settings } from "@/scripts/background/storage/Settings";
import { Ref, ref, watchEffect } from "vue";

let settings:Ref<Settings|undefined> | undefined
let loadingPromise: Promise<Ref<Settings>>|undefined

export function useSettings(){
    if (!settings){
        settings = ref()
        loadingPromise = Settings.load().then(loadedSettings => {
            settings!.value = loadedSettings
            watchEffect(() => settings!.value && settings!.value.store())
            return settings as Ref<Settings>
        })
    }
 
    return {settings, loadingPromise: loadingPromise as Promise<Ref<Settings>>}
}