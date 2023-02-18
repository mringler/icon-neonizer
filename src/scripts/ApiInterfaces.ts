import type {ImageDataRecord} from "./background/icon-storage"
import type { GradientDrawerOptions } from "./background/svg-drawer/gradient-drawer-options"

export interface ApiMessage<ApiInterface extends ScriptsApi> {
    command: keyof ApiInterface,
    args: any[]
}

export interface ScriptsApi {
    [commandName: string]: (...args: any[]) => any
}

export interface ContentApiInterface extends ScriptsApi {
    setIcon: (svg: string) => void
    getOriginalFaviconUrl: () => string,
    verifyHref: (href: string) => void
}

export interface BackgroundApiInterface extends ScriptsApi {
    processIconUrl: (iconUrl: string, force: boolean, store?: boolean) => Promise<string | null>
    getStoredIcon: (iconUrl: string) => Promise<string | null>
    getStoredIcons: () => Promise<ImageDataRecord[]>
    storeIcon: (iconUrl: string, icon: string, noOverride?: boolean) => void
    removeIcon: (iconUrl: string) => void
    getOptions: () => Promise<GradientDrawerOptions>,
    traceWithOptions: (iconUrl: string, options: Partial<GradientDrawerOptions>) => Promise<string>
}


type ApiCommandParameters<ApiInterface extends ScriptsApi, key extends keyof ApiInterface> = Parameters<ApiInterface[key]>
type ApiCommandReturn<ApiInterface extends ScriptsApi, key extends keyof ApiInterface> = ReturnType<ApiInterface[key]>
export type ApiCaller<ApiInterface extends ScriptsApi> = <CommandName extends keyof ApiInterface>(
    commandName: CommandName,
    commandArgs: ApiCommandParameters<ApiInterface, CommandName>,
    ...args: any[]
) => Promise<ApiCommandReturn<ApiInterface, CommandName>>
