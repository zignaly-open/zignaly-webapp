import React from "react";
import { Box, Checkbox, FormControlLabel } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import { setShowBalance } from "../../../store/actions/settings";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import ThemeSwitcher from "../../ThemeSwitcher";
import "./Preferences.scss";

const Preferences = () => {
  const dispatch = useDispatch();
  const storeSettings = useStoreSettingsSelector();

  return (
    <Box alignItems="flex-start" className="preferences" display="flex" flexDirection="column">
      <Box>
        <label className="customLabel">
          <FormattedMessage id="preferences.darklight" />
        </label>
        <ThemeSwitcher full={true} />
      </Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={storeSettings.showBalance}
            color="primary"
            name="showBalance"
            onChange={() => dispatch(setShowBalance(!storeSettings.showBalance))}
          />
        }
        label={<FormattedMessage id="preferences.balance" />}
      />
    </Box>
  );
};

export default Preferences;
