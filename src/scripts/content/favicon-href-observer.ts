type OnHrefChangeHandler = (link: HTMLLinkElement) => any

export class FaviconHrefObserver{
    
    protected static instance: FaviconHrefObserver|null

    public static useObserver(handler: OnHrefChangeHandler){
        if(!FaviconHrefObserver.instance){
            FaviconHrefObserver.instance = new FaviconHrefObserver()
        }
        const instance = FaviconHrefObserver.instance
        instance.setHandler(handler)
        return instance
    }

    protected handler: OnHrefChangeHandler = (e) => {}
    protected observedElements: HTMLLinkElement[] = []
    protected observer: MutationObserver

    protected constructor(){
        this.observer = new MutationObserver(this.observerCallback.bind(this));
    }

    protected setHandler(handler: OnHrefChangeHandler){
        this.handler = handler
    }

    public observe(linkElement: HTMLLinkElement){
        if(this.observedElements.includes(linkElement)){
            return
        }
        this.observedElements.push(linkElement)
        this.observer.observe(linkElement, { attributeFilter: ['href'] });
    }

    protected observerCallback(mutationList: MutationRecord[], observer: MutationObserver){
        for (const mutation of mutationList) {
            console.log('got mutation', mutation)
            if (mutation.type !== 'attributes') {
                continue
            }
            observer.disconnect()
            observer.takeRecords()
            this.handler(mutation.target as HTMLLinkElement)
            this.observedElements.forEach(linkElement => this.observer.observe(linkElement, { attributeFilter: ['href'] }))
        }
    }
}
