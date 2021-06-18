import React from "react";
import "./LanguageSwitcher.scss";
import { languages } from "../../i18n";
import useStoreSettingsSelector from "../../hooks/useStoreSettingsSelector";
import { useDispatch } from "react-redux";
import { changeLanguage } from "../../store/actions/settings";
import { Button } from "@material-ui/core";
// import FlagIcon from "components/FlagIcon";

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
      {languages.map((lang) => (
        <Button
          className={`langButton ${storeSettings.languageCode === lang.locale ? " selected" : ""}`}
          data-lang-code={lang.locale}
          key={lang.locale}
          onClick={handleLanguageSelection}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
