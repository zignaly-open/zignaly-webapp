import React from "react";
import { Box, Typography, Checkbox, FormControlLabel } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import FillWhite from "../../../images/sidebar/fillWhite.svg";
import { useDispatch } from "react-redux";
import { selectDarkTheme, setShowBalance } from "../../../store/actions/settings";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import ThemeSwitcher from "../../ThemeSwitcher";
import "./Preferences.scss";

const Preferences = () => {
  const dispatch = useDispatch();
  const storeSettings = useStoreSettingsSelector();

  return (
    <Box className="preferences" display="flex" flexDirection="column" alignItems="flex-start">
      <FormControlLabel
        control={<ThemeSwitcher full={true} />}
        label={<FormattedMessage id="preferences.darklight" />}
        labelPlacement="top"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={storeSettings.showBalance}
            onChange={() => dispatch(setShowBalance(!storeSettings.showBalance))}
            name="showBalance"
            color="primary"
          />
        }
        label={<FormattedMessage id="preferences.balance" />}
      />
    </Box>
  );
};

export default Preferences;
