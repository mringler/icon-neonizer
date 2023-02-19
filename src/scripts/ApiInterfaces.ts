type Fun = (...args: any[]) => any
export type ScriptsApi<T extends object = any> = {
    [K in keyof T as T[K] extends Fun ? K : never]: T[K]
}

export type ApiCaller<ApiInterface extends ScriptsApi> = <CommandName extends keyof ApiInterface>(
    commandName: CommandName,
    commandArgs: Parameters<ApiInterface[CommandName]>,
    ...args: any[]
) => Promise<Awaited<ReturnType<ApiInterface[CommandName]>>>

export type ApiListener<ApiInterface extends ScriptsApi> = <CommandName extends keyof ApiInterface>(
    message: {
        command: CommandName,
        args: Parameters<ApiInterface[CommandName]>
    },
    sender: browser.runtime.MessageSender,
    sendResponse: (response?: any) => void
) => void
