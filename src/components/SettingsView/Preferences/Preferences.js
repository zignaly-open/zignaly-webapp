import React from "react";
import { Box, Typography, Checkbox, FormControlLabel } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import FillWhite from "../../../images/sidebar/fillWhite.svg";
import { useDispatch } from "react-redux";
import { selectDarkTheme, setShowBalance } from "../../../store/actions/settings";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import ThemeSwitcher from "../../ThemeSwitcher";

const Preferences = () => {
  const dispatch = useDispatch();
  const storeSettings = useStoreSettingsSelector();

  return (
    <Box className="preferences">
      <Typography>
        <FormattedMessage id="preferences.darklight" />
      </Typography>
      <ThemeSwitcher full={true} />
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
