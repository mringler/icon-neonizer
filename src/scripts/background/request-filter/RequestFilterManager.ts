import type { Settings } from "../storage/Settings"
import { FaviconRequestFilterType } from "./FaviconRequestFilterType"
import { FallbackFaviconRequestFilter } from "./fallback-favicon-request-filter"
import { FaviconRequestFilter } from "./favicon-request-filter"
import { TouchIconRequestFilter } from "./touch-icon-request-filter."


export class RequestFilterManager {
    private static instance: RequestFilterManager | undefined

    protected constructor() { }

    public static init(settings: Settings) {
        if (!RequestFilterManager.instance) {
            RequestFilterManager.instance = new RequestFilterManager()
        }
        RequestFilterManager.instance.setFaviconRequestFilter(settings)
        RequestFilterManager.instance.setTouchIconFilter(settings)
    }

    protected currentIconFilter: FaviconRequestFilterType | undefined
    protected removeIconFilter: (() => any) | undefined

    protected removeTouchIconFilter: (() => any) | undefined


    public setFaviconRequestFilter(settings: Settings) {
        const type = settings.faviconRequestFilter
        if (this.currentIconFilter === type) {
            return
        }
        this.removeIconFilter && this.removeIconFilter()
        this.removeIconFilter = this.getFaviconRequestFilterByType(type)
    }

    protected getFaviconRequestFilterByType(type: FaviconRequestFilterType): () => void {
        switch (type) {
            case FaviconRequestFilterType.fallback: return FallbackFaviconRequestFilter.setRequestFilter()
            case FaviconRequestFilterType.byName:
            default:
                return FaviconRequestFilter.setRequestFilter()
        }
    }

    public setTouchIconFilter(settings: Settings) {
        const filterTouchIcon = settings.filterTouchIcon
        if (filterTouchIcon && !this.removeTouchIconFilter) {
            this.removeIconFilter = TouchIconRequestFilter.setRequestFilter()
        } else if (!filterTouchIcon && this.removeTouchIconFilter) {
            this.removeTouchIconFilter()
            this.removeTouchIconFilter = undefined
        }
    }
}