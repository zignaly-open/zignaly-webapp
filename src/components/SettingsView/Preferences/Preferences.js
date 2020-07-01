import React from "react";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import FillWhite from "../../../images/sidebar/fillWhite.svg";
import { useDispatch } from "react-redux";
import { selectDarkTheme } from "../../../store/actions/settings";
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
      <Typography>
        <FormattedMessage id="preferences.balance" />
      </Typography>
    </Box>
  );
};

export default Preferences;
