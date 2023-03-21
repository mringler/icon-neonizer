
type ApiArgs<T, P extends keyof T = keyof T> = { [K in P]: T[K] extends (...args: infer A) => any ? A : never }[P]
type Ret<T, P extends keyof T = keyof T> = { [K in P]: T[K] extends (...args: any) => infer R ? R : never }[P]
export type ScriptsApi<T> = { [K in keyof T]: (...args: ApiArgs<T, K>) => Ret<T, K> }

export type ApiCaller<ApiInterface extends ScriptsApi<ApiInterface>> = <CommandName extends keyof ApiInterface>(
    commandName: CommandName,
    commandArgs: Parameters<ApiInterface[CommandName]>,
    ...args: any[]
) => Promise<Awaited<ReturnType<ApiInterface[CommandName]>>>

export type ApiListener<ApiInterface extends ScriptsApi<ApiInterface>> = <CommandName extends keyof ApiInterface>(
    message: {
        command: CommandName,
        args: Parameters<ApiInterface[CommandName]>
    },
    sender: browser.runtime.MessageSender,
    sendResponse: (response?: any) => void
) => void

export function buildApi<Api extends ScriptsApi<Api>>(apiObject: Api){
    const listener: ApiListener<Api> = (message, sender, sendResponse) => {
        const { command, args } = message;
        const handler = apiObject[command]
        const res = handler(...args);
        sendResponse(res);
    };
    browser.runtime.onMessage.addListener(listener);
}

