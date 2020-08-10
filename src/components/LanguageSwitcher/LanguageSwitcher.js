import React from "react";
import "./LanguageSwitcher.scss";
// @ts-ignore
import Flag from "react-world-flags";
import { languages } from "../../i18n";
import useStoreSettingsSelector from "../../hooks/useStoreSettingsSelector";
import { useDispatch } from "react-redux";
import { changeLanguage } from "../../store/actions/settings";

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
      <Flag className="flag" code="en" />

      {languages.map((lang) =>
        lang.locale === storeSettings.languageCode ? (
          <Flag className="flag" code={lang.countryCode} key={lang.locale} title={lang.label} />
        ) : (
          <button
            data-lang-code={lang.locale}
            key={lang.locale}
            onClick={handleLanguageSelection}
            type="button"
          >
            <Flag className="flag" code={lang.countryCode} key={lang.locale} title={lang.label} />
          </button>
        ),
      )}
    </div>
  );
};

export default LanguageSwitcher;
