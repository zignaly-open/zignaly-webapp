import React from "react";
import { languages } from "../../../i18n";
import useStoreSettingsSelector from "../../../src/hooks/useStoreSettingsSelector";
import { useDispatch } from "react-redux";
import { changeLanguage } from "store/actions/settings";
import { Select, MenuItem } from "@mui/material";
// import FlagIcon from "components/FlagIcon";

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
        value={storeSettings.locale}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.locale} value={lang.locale}>
            {/* <FlagIcon className="flag" code={lang.countryCode} titleName={lang.label} /> */}
            {lang.label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
