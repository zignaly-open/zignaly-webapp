import React from "react";
import "./LanguageSwitcher.scss";
import { languages } from "../../i18n";
import useStoreSettingsSelector from "../../hooks/useStoreSettingsSelector";
import { useDispatch } from "react-redux";
import { changeLanguage } from "../../store/actions/settings";
import { Button } from "@mui/material";
// import FlagIcon from "components/FlagIcon";
import tradeApi from "../../services/tradeApiClient";
import { getUserData } from "store/actions/user";
import { showErrorAlert } from "store/actions/ui";

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
    const locale = targetElement.getAttribute("data-lang-code");
    if (locale) {
      dispatch(changeLanguage(locale));
      tradeApi
        .saveLocale({ locale })
        .then(() => {
          dispatch(getUserData(false));
        })
        .catch((e) => dispatch(showErrorAlert(e)));
    }
  };

  return (
    <div className="languageSwitcher">
      {languages.map((lang) => (
        <Button
          className={`langButton ${storeSettings.locale === lang.locale ? " selected" : ""}`}
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
