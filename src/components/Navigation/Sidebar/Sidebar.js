import React, { useState } from "react";
import "./Sidebar.scss";
import { Box, Typography } from "@material-ui/core";
import Link from "../../LocalizedLink";
import { useDispatch } from "react-redux";
import SignalWhite from "../../../images/sidebar/signalWhite.svg";
import SignalBlack from "../../../images/sidebar/signalBlack.svg";
import TerminalWhite from "../../../images/sidebar/terminalWhite.svg";
import TerminlBlack from "../../../images/sidebar/terminalBlack.svg";
import CopyWhite from "../../../images/sidebar/copyWhite.svg";
import CopyBlack from "../../../images/sidebar/copyBlack.svg";
import FillWhite from "../../../images/sidebar/fillWhite.svg";
import OutlineWhite from "../../../images/sidebar/outlineWhite.svg";
import OutlineBlack from "../../../images/sidebar/outlineBlack.svg";
import DashboardWhite from "../../../images/sidebar/dashboardWhite.svg";
import DashboardBlack from "../../../images/sidebar/dashboardBlack.svg";
import { selectDarkTheme } from "../../../store/actions/settings";
import { FormattedMessage } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";

/**
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 */

const Sidebar = () => {
  const storeSettings = useStoreSettingsSelector();
  const [hover, setHover] = useState(false);
  const dispatch = useDispatch();

  const showFullMenu = () => {
    setHover(true);
  };

  const showSmallMenu = () => {
    setHover(false);
  };

  return (
    <Box
      alignItems="flex-start"
      bgcolor="grid.main"
      className={"sidebar " + (hover ? "full" : "")}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      onMouseEnter={showFullMenu}
      onMouseLeave={showSmallMenu}
      onMouseOver={showFullMenu}
    >
      <Link
        activeClassName={"active"}
        className={"sideBarLink"}
        partiallyActive={true}
        to={"/dashboard/positions"}
      >
        <img
          alt="zignaly"
          className={"icon"}
          src={storeSettings.darkStyle ? DashboardWhite : DashboardBlack}
        />
        <Typography variant="h6">
          <FormattedMessage id="menu.dashboard" />
        </Typography>
      </Link>
      <Link
        activeClassName={"active"}
        className={"sideBarLink"}
        partiallyActive={true}
        to={"/copyTraders/browse"}
      >
        <img
          alt="zignaly"
          className={"icon"}
          src={storeSettings.darkStyle ? CopyWhite : CopyBlack}
        />
        <Typography variant="h6">
          <FormattedMessage id="menu.copytraders" />
        </Typography>
      </Link>
      <Link
        activeClassName={"active"}
        className={"sideBarLink"}
        partiallyActive={true}
        to={"/signalProviders/browse"}
      >
        <img
          alt="zignaly"
          className={"icon"}
          src={storeSettings.darkStyle ? SignalWhite : SignalBlack}
        />
        <Typography variant="h6">
          <FormattedMessage id="menu.signalproviders" />
        </Typography>
      </Link>
      <Link
        activeClassName={"active"}
        className={"sideBarLink"}
        partiallyActive={true}
        to={"/tradingTerminal"}
      >
        <img
          alt="zignaly"
          className={"icon"}
          src={storeSettings.darkStyle ? TerminalWhite : TerminlBlack}
        />
        <Typography variant="h6">
          <FormattedMessage id="menu.tradingterminal" />
        </Typography>
      </Link>
      <Box className={"themeBox"} display="flex" flexDirection="row" flexWrap="nowrap">
        {hover && (
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
        )}
        {!hover && (
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
    </Box>
  );
};

export default Sidebar;
