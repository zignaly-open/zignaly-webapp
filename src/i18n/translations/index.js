/**
 * @type {Object<string, any>} translations
 */
const translations = {
  cs: () => import("./cs.yml"),
  en: () => import("./en.yml"),
  vn: () => import("./vn.yml"),
  de: () => import("./de.yml"),
  pl: () => import("./pl.yml"),
  es: () => import("./es.yml"),
  tr: () => import("./tr.yml"),
  fr: () => import("./fr.yml"),
  pt: () => import("./pt.yml"),
  ru: () => import("./ru.yml"),
  uk: () => import("./uk.yml"),
};

export default translations;
