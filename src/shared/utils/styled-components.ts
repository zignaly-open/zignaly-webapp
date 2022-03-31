/**
 * Makes a conditional render of styles, this function is implemented to prevent renderings "undefined" within the CSS and to make the reading more comfortable.
 * @param cond Operation or conditional.
 * @param primaryQuery code to render within the operation logic. It acts as the first value when a elseif is detected.
 * @param secondaryQuery secondary code, optional and applicable as a else-if. Render CSS.
 * @returns {string} One or the other query depending on the conditional we assign.
 */
export const isConditional = (cond: any, primaryQuery: string, secondaryQuery : string | null = null) => {
  return !secondaryQuery ? cond ? primaryQuery : "" : cond ? primaryQuery : secondaryQuery;
};

// Mobile
export const isMobile = (query: string) => {
  return `@media screen and (min-width: 0px) and (max-width: 990px) { ${query} }`;
};

export const isTablet = (query: string) => {
  return `@media screen and (min-width: 991px) and (max-width: 1100px) { ${query} }`;
};

export const media = (size: number, query: string) => {
  return `@media screen and (min-width: ${size}px) { ${query} }`;
};

export const isNotMobile = (query: string) => {
  return `@media screen and (min-width: 990px) { ${query} }`;
};
