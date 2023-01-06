import type { BackgroundApiInterface, ApiCaller} from "@/scripts/ApiInterfaces";


export const callBackgroundApi: ApiCaller<BackgroundApiInterface> = (command, args) => {
    return browser.runtime.sendMessage({ command, args }) as ReturnType<ApiCaller<BackgroundApiInterface>>;
}