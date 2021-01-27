// import en from "./en.yml";
// import cs from "./cs.yml";
// import vn from "./vn.yml";
// import de from "./de.yml";
// import pl from "./pl.yml";
// import es from "./es.yml";

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
};

export default translations;
