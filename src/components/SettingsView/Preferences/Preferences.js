import React from "react";
import { Box, Checkbox, FormControlLabel } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import { toggleBalanceBox } from "../../../store/actions/settings";
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
            checked={storeSettings.balanceBox}
            color="primary"
            onChange={() => dispatch(toggleBalanceBox(!storeSettings.balanceBox))}
          />
        }
        label={<FormattedMessage id="preferences.balance" />}
      />
    </Box>
  );
};

export default Preferences;
