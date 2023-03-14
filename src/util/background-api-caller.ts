import type {ApiCaller} from "@/scripts/ApiInterfaces";
import type { BackgroundApiInterface } from "@/scripts/background/background-api";


export const callBackgroundApi: ApiCaller<BackgroundApiInterface> = (command, args) => {
    return browser.runtime.sendMessage({ command, args });
}