import type { Options } from "@image-tracer/core"
import type {ImageDataRecord} from "./background/icon-storage"

export interface ApiMessage<ApiInterface extends ScriptsApi> {
    command: keyof ApiInterface,
    args: any[]
}

export interface ScriptsApi {
    [commandName: string]: (...args: any[]) => any
}

export interface ContentApiInterface extends ScriptsApi {
    log: (...args: any[]) => void
    setIcon: (svg: string) => void
    logFavicon: () => void,
    getOriginalFaviconUrl: () => string,
    getCurrentFavicon: () => string | null,
    getCurrentFaviconData: () => string | null,
    rebuildIcon: () => void
}

export interface BackgroundApiInterface extends ScriptsApi {
    processIconUrl: (iconUrl: string, force: boolean) => Promise<string | null>
    getStoredIcon: (iconUrl: string) => Promise<string | null>
    getStoredIcons: () => Promise<ImageDataRecord[]>
    storeIcon: (iconUrl: string, icon: string, noOverride?: boolean) => void
    removeIcon: (iconUrl: string) => void
    getOptions: () => Options,
    traceWithOptions: (iconUrl: string, options: Partial<Options>) => Promise<string>
}


type ApiCommandParameters<ApiInterface extends ScriptsApi, key extends keyof ApiInterface> = Parameters<ApiInterface[key]>
type ApiCommandReturn<ApiInterface extends ScriptsApi, key extends keyof ApiInterface> = ReturnType<ApiInterface[key]>
export type ApiCaller<ApiInterface extends ScriptsApi> = <CommandName extends keyof ApiInterface>(
    commandName: CommandName,
    commandArgs: ApiCommandParameters<ApiInterface, CommandName>,
    ...args: any[]
) => Promise<ApiCommandReturn<ApiInterface, CommandName>>




/*
const test: ApiCaller<BackgroundApiInterface> = (c, a) => null

test('processIconUrl', ['url', true]);
test('processIconUrl', [true, 'ferd']);
*/
