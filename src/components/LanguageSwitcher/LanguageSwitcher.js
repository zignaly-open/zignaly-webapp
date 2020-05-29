import React from "react";
import cs from "../../images/cs.png";
import en from "../../images/en.png";
import { languages } from "../../i18n";
import "./languageSwitcher.scss";

/**
 * @type {Object.<string, string>} flags
 */
const flags = {
  cs,
  en,
};

const LanguageSwitcher = () => (
  <div className="languageSwitcher">
    {languages.map((lang) =>
      lang.locale === locale ? (
        <img alt={lang.label} key={lang.locale} src={flags[lang.locale]} />
      ) : (
        <button type="button">
          <img alt={lang.label} src={flags[lang.locale]} />
        </button>
      ),
    )}
  </div>
);

export default LanguageSwitcher;
