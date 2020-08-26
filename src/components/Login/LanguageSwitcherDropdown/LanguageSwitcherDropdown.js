import React from "react";
import "./LanguageSwitcherDropdown.scss";
// @ts-ignore
import Flag from "react-world-flags";
import { languages } from "../../../i18n";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { useDispatch } from "react-redux";
import { changeLanguage } from "../../../store/actions/settings";
import { Select, MenuItem } from "@material-ui/core";

const LanguageSwitcher = () => {
  const storeSettings = useStoreSettingsSelector();
  const dispatch = useDispatch();

  /**
   * Dispatch language selection persistance in the store.
   *
   * @param {React.ChangeEvent<*>} e Language selection click.
   * @returns {Void} None.
   */
  const handleLanguageSelection = (e) => {
    let targetValue = e.target.value;
    dispatch(changeLanguage(targetValue));
  };

  return (
    <div className="languageSwitcherDropdown">
      <Select
        className="languageSelect"
        classes={{
          selectMenu: "menu",
        }}
        onChange={handleLanguageSelection}
        value={storeSettings.languageCode}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.locale} value={lang.countryCode}>
            <Flag className="flag" code={lang.countryCode} title={lang.label} />
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
