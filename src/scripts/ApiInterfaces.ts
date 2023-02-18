type Fun = (...args: any[]) => any
export type ScriptsApi<T extends object = any> = {
    [K in keyof T as T[K] extends Fun ? K : never]: T[K]
}

type ApiCommandParameters<ApiInterface extends ScriptsApi, key extends keyof ApiInterface> = Parameters<ApiInterface[key]>
type ApiCommandReturn<ApiInterface extends ScriptsApi, key extends keyof ApiInterface> = ReturnType<ApiInterface[key]>
export type ApiCaller<ApiInterface extends ScriptsApi> = <CommandName extends keyof ApiInterface>(
    commandName: CommandName,
    commandArgs: ApiCommandParameters<ApiInterface, CommandName>,
    ...args: any[]
) => Promise<ApiCommandReturn<ApiInterface, CommandName>>

export type ApiListener<ApiInterface extends ScriptsApi> = <CommandName extends keyof ApiInterface>(
    message: {
        command: CommandName,
        args: ApiCommandParameters<ApiInterface, CommandName>
    },
    sender: browser.runtime.MessageSender,
    sendResponse: (response?: any) => void
) => void