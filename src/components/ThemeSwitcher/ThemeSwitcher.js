import React from "react";
import "./ThemeSwitcher.scss";
import useStoreSettingsSelector from "../../hooks/useStoreSettingsSelector";
import { useDispatch } from "react-redux";
import { selectDarkTheme } from "../../store/actions/settings";
import { Box } from "@mui/material";
import OutlineWhite from "../../images/sidebar/outlineWhite.svg";
import OutlineBlack from "../../images/sidebar/outlineBlack.svg";
import FillWhite from "../../images/sidebar/fillWhite.svg";

/**
 * @typedef {Object} ThemeSwitcherPropTypes
 * @property {boolean} full Flag to indicate if switcher is expanded with 2 toggle buttons.
 */

/**
 * Provides a component to switch dark mode.
 *
 * @param {ThemeSwitcherPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ThemeSwitcher = ({ full }) => {
  const storeSettings = useStoreSettingsSelector();
  const dispatch = useDispatch();

  return (
    <Box className="themeSwitcher" display="flex" flexDirection="row" flexWrap="nowrap">
      {full ? (
        <>
          <Box
            className={storeSettings.darkStyle ? "checkedDarkBox" : "darkBox"}
            display="flex"
            flexDirection="row"
            justifyContent="center"
          >
            <img
              alt="zignaly"
              className={"icon"}
              onClick={() => dispatch(selectDarkTheme(true))}
              src={storeSettings.darkStyle ? OutlineWhite : OutlineBlack}
            />
          </Box>
          <Box
            className={!storeSettings.darkStyle ? "checkedLightBox" : "lightBox"}
            display="flex"
            flexDirection="row"
            justifyContent="center"
          >
            <img
              alt="zignaly"
              className={"icon"}
              onClick={() => dispatch(selectDarkTheme(false))}
              src={FillWhite}
            />
          </Box>
        </>
      ) : (
        <Box
          className={storeSettings.darkStyle ? "checkedDarkBox" : "checkedLightBox"}
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <img
            alt="zignaly"
            className={"icon"}
            src={storeSettings.darkStyle ? OutlineWhite : FillWhite}
          />
        </Box>
      )}
    </Box>
  );
};

export default ThemeSwitcher;
