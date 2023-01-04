import { initBackgroundApi } from "./background-api";
import { FaviconRequestFilter } from "./favicon-request-filter";


console.log('Background here');
FaviconRequestFilter.setRequestFilter();
initBackgroundApi();
console.log('Background up');