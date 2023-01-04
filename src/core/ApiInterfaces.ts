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
    storeIcon: (iconUrl: string, icon: string) => void
}


type ApiCommandParameters<ApiInterface extends ScriptsApi, key extends keyof ApiInterface> = Parameters<ApiInterface[key]>
type ApiCommandReturn<ApiInterface extends ScriptsApi, key extends keyof ApiInterface> = ReturnType<ApiInterface[key]>
export type ApiCaller<ApiInterface extends ScriptsApi> = <CommandName extends keyof ApiInterface>(
    commandName: CommandName,
    args: ApiCommandParameters<ApiInterface, CommandName>
) => Promise<ApiCommandReturn<ApiInterface, CommandName>>




/*
const test: ApiCaller<BackgroundApiInterface> = (c, a) => null

test('processIconUrl', ['url', true]);
test('processIconUrl', [true, 'ferd']);
*/
