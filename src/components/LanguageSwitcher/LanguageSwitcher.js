import React from "react";
import "./LanguageSwitcher.scss";
import cs from "../../images/cs.png";
import en from "../../images/en.png";
import { languages } from "../../i18n";
import useStoreSettingsSelector from "../../hooks/useStoreSettingsSelector";
import { useDispatch } from "react-redux";
import { changeLanguage } from "../../store/actions/settings";

/**
 * @type {Object.<string, string>} flags
 */
const flags = {
  cs,
  en,
};

const LanguageSwitcher = () => {
  const storeSettings = useStoreSettingsSelector();
  const dispatch = useDispatch();

  /**
   * Dispatch language selection persistance in the store.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} event Language selection click.
   * @returns {Void} None.
   */
  const handleLanguageSelection = (event) => {
    const targetElement = event.currentTarget;
    const languageCode = targetElement.getAttribute("data-lang-code");
    if (languageCode) {
      dispatch(changeLanguage(languageCode));
    }
  };

  return (
    <div className="languageSwitcher">
      {languages.map((lang) =>
        lang.locale === storeSettings.languageCode ? (
          <img alt={lang.label} key={lang.locale} src={flags[lang.locale]} />
        ) : (
          <button data-lang-code={lang.locale} onClick={handleLanguageSelection} type="button">
            <img alt={lang.label} src={flags[lang.locale]} />
          </button>
        ),
      )}
    </div>
  );
};

export default LanguageSwitcher;
