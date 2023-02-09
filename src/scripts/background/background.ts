import { initBackgroundApi } from "./background-api";
import { FaviconRequestFilter } from "./favicon-request-filter";
import { IconStorage } from "./icon-storage";


console.log('Background here');
FaviconRequestFilter.setRequestFilter();
initBackgroundApi();
console.log('Background up');

setTimeout(() => IconStorage.cleanup(), 60_000)
