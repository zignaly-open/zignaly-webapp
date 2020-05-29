import React from "react";
import cs from "../../images/cs.png";
import en from "../../images/en.png";
import { languages } from "../../i18n";
import "./languageSwitcher.scss";
import useStoreSettingsSelector from "../../hooks/useStoreSettingsSelector";

/**
 * @type {Object.<string, string>} flags
 */
const flags = {
  cs,
  en,
};

const LanguageSwitcher = () => {
  const storeSettings = useStoreSettingsSelector();

  return (
    <div className="languageSwitcher">
      {languages.map((lang) =>
        lang.locale === storeSettings.languageCode ? (
          <img alt={lang.label} key={lang.locale} src={flags[lang.locale]} />
        ) : (
          <button type="button">
            <img alt={lang.label} src={flags[lang.locale]} />
          </button>
        ),
      )}
    </div>
  );
};

export default LanguageSwitcher;
